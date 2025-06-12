using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OrderManager.Core.Utils;

namespace OrderManager.Web.Infrastructure;

public class BusinessRuleExceptionHandler : IExceptionHandler
{
    public ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception,
        CancellationToken cancellationToken)
    {
        if (exception is not BusinessRuleException businessRuleException) return new ValueTask<bool>(false);

        httpContext.Response.ContentType = "application/json";
        httpContext.Response.StatusCode = StatusCodes.Status400BadRequest;
        httpContext.Response.WriteAsJsonAsync(new ValidationProblemDetails
        {
            Status = StatusCodes.Status400BadRequest,
            Title = "Business rule violation",
            Detail = businessRuleException.Message
        }, cancellationToken);

        return new ValueTask<bool>(true);
    }
}