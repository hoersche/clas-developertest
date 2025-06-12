using System;
using System.IO;
using System.Reflection;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using OrderManager.Web;
using Serilog;
using Serilog.Events;
using Serilog.Formatting.Compact;

var loggerConfig = new LoggerConfiguration()
    .MinimumLevel.Override("Microsoft", LogEventLevel.Warning)
    .MinimumLevel.Override("Microsoft.EntityFrameworkCore.Model", LogEventLevel.Warning)
    .MinimumLevel.Override("Microsoft.AspNetCore.Authorization", LogEventLevel.Warning)
    .MinimumLevel.Override("Microsoft.AspNetCore.Hosting.Internal.WebHost", LogEventLevel.Warning)
    .Enrich.WithProperty("Application", "OrderManager")
    .Enrich.WithThreadId()
    .Enrich.FromLogContext()
    .WriteTo.File("./App_Data/logs/log.txt", LogEventLevel.Information,
        "{Timestamp:yyyy-MM-dd HH:mm:ss} [{Level:u4}]<{ThreadId}> [{SourceContext:l}] {Message:lj}{NewLine}{Exception}",
        rollingInterval: RollingInterval.Day,
        retainedFileCountLimit: 90 //most of our applications have a 90 day log retention policy
    )
    .WriteTo.File(new RenderedCompactJsonFormatter(), "./App_Data/logs/log.json", rollingInterval: RollingInterval.Day,
        retainedFileCountLimit: 90,
        restrictedToMinimumLevel: LogEventLevel.Information);
var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? Environments.Production;


if (environment != Environments.Development)
{
    //loggerConfig.WriteTo.RollbarSink("paste the API key here", environment, LogEventLevel.Error);
}

Log.Logger = loggerConfig.CreateLogger();

try
{
    Log.Information("====================================================================");
    Log.Information("Application Starts. Version: {Version}", Assembly.GetEntryAssembly()?.GetName().Version);


    var builder = WebApplication.CreateBuilder(args);

    builder.Host.UseContentRoot(Directory.GetCurrentDirectory());

    var config = builder.Configuration;

    config.Sources.Clear();
    config.AddEnvironmentVariables();
    var env = builder.Environment;
    Log.Information("Hosting Environment: {EnvironmentName}", env.EnvironmentName);
    config.AddJsonFile("config/appsettings.json", false, true)
        .AddJsonFile($"config/appsettings.{env.EnvironmentName}.json", true, true)
        .AddJsonFile($"config/appsettings.{Environment.MachineName}.json", true, true);
    if (env.IsDevelopment())
        // To use secrets please initialize secrets in your project
        // these are enabled by using `dotnet user-secrets init` but there are also gui solutions to manage these.
        config.AddUserSecrets<Startup>();

    config.AddEnvironmentVariables("OrderManager_");


    builder.Host.UseSerilog();
    var startup = new Startup(builder.Configuration, builder.Environment);
    startup.ConfigureServices(builder.Services);

    var app = builder.Build();
    startup.Configure(app, builder.Environment);
    app.Run();
}
catch (Exception e)
{
    Log.Information(e, "Host terminated unexpectedly");
}
finally
{
    Log.CloseAndFlush();
}