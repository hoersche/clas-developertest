using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using OrderManager.Core.Constants;

// using Uiowa.Common.ActiveDirectory;

namespace OrderManager.Web.Infrastructure;

public interface IAuthorizationPolicy
{
    Task<string> GetRole(string hawkId);
    Task<ImpersonateResult> CanImpersonate(string currentUserRole, string hawkIdToBeImpersonated);
}

public class AuthorizationPolicy : IAuthorizationPolicy
{
    // private readonly IAdUtility _adUtility;
    private readonly ILogger<AuthorizationPolicy> _logger;

    public AuthorizationPolicy(ILogger<AuthorizationPolicy> logger
        // , IAdUtility adUtility
    )
    {
        // _adUtility = adUtility;
        _logger = logger;
    }

    public async Task<string> GetRole(string hawkId)
    {
        _logger.LogInformation($"Get User Role for [{hawkId}]");

        return await Task.FromResult<string>(null);
    }

    public async Task<ImpersonateResult> CanImpersonate(string currentUserRole, string hawkIdToBeImpersonated)
    {
        if (currentUserRole != AppRoles.WebMaster) return new ImpersonateResult(false);
        var impersonatedUserRole = await GetRole(hawkIdToBeImpersonated);
        if (impersonatedUserRole == AppRoles.WebMaster) return new ImpersonateResult(false);
        return new ImpersonateResult(true, impersonatedUserRole);
    }
}

public class ImpersonateResult
{
    public ImpersonateResult(bool canImpersonate, string impersonatedUserRole = null)
    {
        CanImpersonate = canImpersonate;
        ImpersonatedUserRole = impersonatedUserRole ?? string.Empty;
    }

    public bool CanImpersonate { get; protected set; }
    public string ImpersonatedUserRole { get; protected set; }
}