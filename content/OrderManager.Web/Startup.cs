using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using OrderManager.Application;
using OrderManager.Application.Common;
using OrderManager.Core.DbContext;
using OrderManager.Web.Infrastructure;
using Uiowa.Common.ActiveDirectory;
using Uiowa.Login.Core.OIDC;
using AuthorizationPolicy = OrderManager.Web.Infrastructure.AuthorizationPolicy;

namespace OrderManager.Web;

public class Startup
{

    public IConfiguration Configuration { get; }
    public IWebHostEnvironment Environment { get; }        

    public Startup(IConfiguration configuration, IWebHostEnvironment environment)
    {
        Environment = environment;
        Configuration = configuration;
    }

    public void ConfigureServices(IServiceCollection services)
    {
        var connString = Configuration.GetValue<string>("ConnectionStrings:OrderManager");
        services.AddDbContext<OrderManagerDbContext>(options => options.UseSqlServer(connString));

        services.AddControllers();
        services.AddAuthentication(authOptions =>
            {
                authOptions.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                authOptions.DefaultChallengeScheme = UiowaOpenIdConnectDefaults.AuthenticationScheme;
            })
            .AddCookie(options =>
            {
                options.Cookie.Name = "OrderManagerAuth";
                options.Cookie.SameSite = SameSiteMode.None;
                options.Cookie.HttpOnly = true;
                options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
                options.Events.OnRedirectToLogin = context =>
                {
                    context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                    return Task.CompletedTask;
                };
            })
            .AddUiowaOpenIdConnect(oidcOptions =>
            {
                oidcOptions.ClientId = Configuration["UiowaOIDC:ClientId"];
                oidcOptions.ClientSecret = Configuration["UiowaOIDC:ClientSecret"];
                // Use default unless set in appsettings
                if (Configuration["UiowaOIDC:Authority"] != null)
                {
                    oidcOptions.Authority = Configuration["UiowaOIDC:Authority"]!;
                }
            }, events =>
            {
                events.OnRedirectToIdentityProvider += context =>
                {
                    // Don't Redirect Web API's if API just say not authorized.
                    var apiPaths = new[] { "/api", "/account/user" };
                    if (apiPaths.Any(path => context.Request.Path.StartsWithSegments(path)))
                    {
                        context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                        context.HandleResponse();
                    }
                    return Task.CompletedTask;
                };
                events.OnUserInformationReceived += async context => {
                    var authPolicy = context.HttpContext.RequestServices.GetRequiredService<IAuthorizationPolicy>();
                    var hawkId = context.User.RootElement.GetString("uiowahawkid");
                    
                    if (hawkId == null)
                    {
                        context.Fail("Missing uiowahawkid claim");
                        return;
                    }
                    
                    var role = await authPolicy.GetRole(hawkId);
                    if (context.Principal?.Identity is ClaimsIdentity identity)
                    {
                        identity.AddClaim(new Claim(ClaimTypes.Role, role));
                    }
                };
            });

        services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new OpenApiInfo { Title = "OrderManager", Version = "v1" });
        });

        services.AddScoped<IAuthorizationPolicy, AuthorizationPolicy>();
        
        services.AddSingleton<IAdUtility, AdUtility>();
        services.AddHttpContextAccessor();
        services.AddProblemDetails();
        services.AddExceptionHandler<BusinessRuleExceptionHandler>();
        services.AddScoped<IUser, CurrentUser>();
        services.AddApplicationLayer();
        services.AddMemoryCache();

        services.AddHealthChecks();
    }

    public void Configure(IApplicationBuilder app, IHostEnvironment env)
    {
        app.UseExceptionHandler();
        app.UseStatusCodePages();
        
        if (env.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "OrderManager API V1");
            });
        }
        else
        {
            app.UseHsts(options => options.MaxAge(days: 365).Preload().IncludeSubdomains());
            app.UseXXssProtection(options => options.EnabledWithBlockMode());
            app.UseXfo(options => options.SameOrigin());
            app.UseCsp(opts => opts
                .BlockAllMixedContent()
                .StyleSources(s => s.Self())
                .StyleSources(s => s.UnsafeInline())
                .FontSources(s => s.Self().CustomSources("data:"))
                .FormActions(s => s.Self())
                .FrameAncestors(s => s.Self())
                .ImageSources(s => s.Self().CustomSources("data:"))
                .ScriptSources(s => s.Self().UnsafeEval().UnsafeInline())
            );
            app.UseXContentTypeOptions();
            app.UseReferrerPolicy(opts => opts.NoReferrer());
        }

        app.UseHttpsRedirection();
        app.UseStaticFiles();
        app.UseAuthentication();
        app.UseUserLoggingMiddleware();
        app.UseRouting();
        app.UseAuthorization();

        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllers().RequireAuthorization();
            endpoints.MapHealthChecks("/health");
            endpoints.MapFallbackToFile("index.html");
        });
            
    }
}