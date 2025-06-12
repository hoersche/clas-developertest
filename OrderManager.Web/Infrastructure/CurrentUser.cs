using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using OrderManager.Application.Common;
using OrderManager.Core.Constants;
using Uiowa.Login.Core.OIDC;

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
    public string? UnivId => User?.FindFirstValue(UiowaOpenIdClaimTypes.UniversityId);
    public string? OriginalUser => User?.FindFirstValue(AppClaims.OriginalUser);
    public string? Role => User?.FindFirstValue(ClaimTypes.Role);
}