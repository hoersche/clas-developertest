using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace OrderManager.Web.Controllers;

[ApiExplorerSettings(IgnoreApi = true)]
[ApiController]
public class ErrorController : ControllerBase
{
    private readonly ILogger<ErrorController> _logger;

    public ErrorController(ILogger<ErrorController> logger)
    {
        _logger = logger;
    }

    [HttpGet("api/{*url}", Order = int.MaxValue)]
    public ActionResult CatchAll()
    {
        var msg = $"Error: API endpoint [{Request.Path}] NOT FOUND.";
        _logger.LogInformation("Error: API endpoint [{Request.Path}] NOT FOUND", Request.Path);
        return NotFound(msg);
    }
}