using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Net.Http.Headers;
using OrderManager.Application.Users;
using OrderManager.Core.Constants;
using OrderManager.Core.Utils;
using OrderManager.Web.Infrastructure;
using OrderManager.Web.Requests;
// Commented out to get working
// Assuming there is a UIOWA NuGet Artifactory I don't have access to
// Since I don't have a UI Login I dont suspect I will use these methods.
// using Uiowa.Login.Core.OIDC;

namespace OrderManager.Web.Controllers;

[Route("[controller]")]
[ApiExplorerSettings(IgnoreApi = true)]
public class AccountController : ControllerBase
{
    private readonly IAuthorizationPolicy _authorizationPolicy;
    private readonly ILogger<AccountController> _logger;

    public AccountController(IAuthorizationPolicy authorizationPolicy, ILogger<AccountController> logger)
    {
        _authorizationPolicy = authorizationPolicy;
        _logger = logger;
    }

    [HttpGet("login")]
    [AllowAnonymous]
    public ActionResult Login([FromQuery] string returnUri)
    {
        // Prevent open redirect attack
        var redirectUri = Url.IsLocalUrl(returnUri) ? returnUri : Url.Content("~/home");
        var hawkId = User?.Identity?.Name;
        if (!string.IsNullOrEmpty(hawkId))
        {
            _logger.LogInformation("User [{HawkId}] is already logged in", hawkId);
            return Redirect(redirectUri);
        }

        _logger.LogInformation("User is not logged in, redirecting to login page");
        //redirect to returnUri
        return Challenge(new AuthenticationProperties
        {
            RedirectUri = redirectUri
        });
    }

    [HttpGet("logout")]
    public async Task Logout()
    {
        // JAG Commented this code out since I dont have a UIowa userid, these won't be used for this
        // exercise
        /*
        var hawkId = User?.Identity?.Name;
        _logger.LogInformation("User [{HawkId}] is logging out", hawkId);
        // Destroy our application's session cookie            
        await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        // Redirects the user to uiowa logout page            
        await HttpContext.SignOutAsync(UiowaOpenIdConnectDefaults.AuthenticationScheme);
        */
    }

    [HttpGet("user")]
    [ProducesResponseType(typeof(CurrentUserDto), StatusCodes.Status200OK)]
    public async Task<CurrentUserDto?> GetUser([FromServices] UsersService usersService)
    {
        var currentUser = usersService.GetCurrentUser();
        if (string.IsNullOrEmpty(currentUser?.HawkId)) return null;

        var userAgent = Request.Headers[HeaderNames.UserAgent].ToString();
        _logger.LogInformation("[{HawkId}] User-Agent: {UserAgent}", currentUser.HawkId, userAgent);
        return currentUser;
    }

    [Authorize(Roles = AppRoles.Admin + "," + AppRoles.WebMaster)]
    [HttpPost("impersonation")]
    [ProducesResponseType(typeof(bool), StatusCodes.Status200OK)]
    public async Task<bool> Impersonation([FromBody] ImpersonationRequest request)
    {
        var currentUserHawkId = User.Identity.Name;
        _logger.LogInformation("User [{CurrentUserHawkId}] is trying to impersonate [{ImpersonationHawkId}]",
            currentUserHawkId, request.HawkId);
        var originalUserHawkId = User.FindFirst("OriginalUser")?.Value;
        if (!string.IsNullOrEmpty(originalUserHawkId))
        {
            _logger.LogInformation(
                "User [{CurrentUserHawkId}] failed to impersonate [{ImpersonationHawkId}] already impersonating by [{OriginalUserHawkId}]",
                currentUserHawkId, request.HawkId, originalUserHawkId);
            throw new BusinessRuleException("Double-hop impersonation is NOT allowed.");
        }

        var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
        var impersonateResult = await _authorizationPolicy.CanImpersonate(userRole, request.HawkId);
        if (!impersonateResult.CanImpersonate)
        {
            _logger.LogInformation("User [{CurrentUserHawkId}] not authorized to impersonate [{ImpersonationHawkId}]",
                currentUserHawkId, request.HawkId);
            return false;
        }

        var claims = new List<Claim>
        {
            new(ClaimTypes.Name, request.HawkId),
            new(ClaimTypes.Role, impersonateResult.ImpersonatedUserRole ?? string.Empty),
            new("OriginalUser", currentUserHawkId)
        };

        var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
        await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme,
            new ClaimsPrincipal(claimsIdentity));
        return true;
    }

    [HttpPost("impersonation/stop")]
    [ProducesResponseType(typeof(bool), StatusCodes.Status200OK)]
    public async Task<bool> StopImpersonation()
    {
        var currentUserHawkId = User.Identity.Name;
        _logger.LogInformation("Stopping impersonation from [{CurrentUserHawkId}] ...", currentUserHawkId);
        var originalUserHawkId = User.FindFirst("OriginalUser")?.Value;
        if (string.IsNullOrWhiteSpace(originalUserHawkId))
        {
            _logger.LogInformation("\t failed...");
            throw new BusinessRuleException("You are not impersonating anyone.");
        }

        var userRole = await _authorizationPolicy.GetRole(originalUserHawkId);

        var claims = new List<Claim>
        {
            new(ClaimTypes.Name, originalUserHawkId),
            new(ClaimTypes.Role, userRole ?? string.Empty),
            new("OriginalUser", string.Empty)
        };

        await HttpContext.SignOutAsync();
        var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
        await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme,
            new ClaimsPrincipal(claimsIdentity));
        return true;
    }

    [HttpGet("AccessDenied")]
    [AllowAnonymous]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public IActionResult AccessDenied()
    {
        var currentUserHawkId = User.Identity.Name;
        var returnUri = Request.Query["ReturnUrl"];
        _logger.LogInformation("User [{CurrentUserHawkId}] tried to access {ReturnUri}, but failed", currentUserHawkId,
            returnUri);
        return StatusCode(403, $"Not Authorized Access to {returnUri}");
    }
}