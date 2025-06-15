using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using OrderManager.Application.Common;
using OrderManager.Core.Constants;
// JAG Need to remove this dependency as I dont have access to the UIowa nuget packages
// See JAG tag
// using Uiowa.Login.Core.OIDC;

namespace OrderManager.Web.Infrastructure;

public class CurrentUser : IUser
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CurrentUser(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    private ClaimsPrincipal? User => _httpContextAccessor.HttpContext?.User;

    public string? Name => User?.FindFirstValue(ClaimTypes.Name);
    public string? UnivId => "";// JAG User?.FindFirstValue(UiowaOpenIdClaimTypes.UniversityId);
    public string? OriginalUser => User?.FindFirstValue(AppClaims.OriginalUser);
    public string? Role => User?.FindFirstValue(ClaimTypes.Role);
}