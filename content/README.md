# CLAS Web Application Template

## Template Application: OrderManager

It is a sample web application based on ASP.NET Core and Angular.

**Requires**:
* .Net Core 6.0 - Visual Studio 2022 or Jetbrains Rider


**Features**:
* .Net Core 6
* Angular CLI
* Bootstrap 4.5, font-awesome 5
* Webpage layout with UIowa header, footer
* Angular modules, routes, services, components examples
* ASP.NET Core web app SetUp
* EF Core SQL DbContext setup
* Swagger
* Serilog
* UiowaHawkIdUIP Login
* SPA service setup
* Web API examples
* ...

## Template Installation

Install Template Nuget (this step is need for first time usage or when updating template to newer versions)

```Powershell
dotnet new -i clasweb
```

## Create a new solution

1. Make a solution folder, then change directory into it, create a new CLAS Web solution. eg,

    ```Powershell
    PS C:\Projects\CLAS> mkdir MyApp
    PS C:\Projects\CLAS> cd .\MyApp\
    PS C:\Projects\CLAS\MyApp> dotnet new clasweb
    The template "CLAS Web Application" was created successfully.
    ```

1. Change directory to the web project, install npm packages. This step will take about 2 minutes for npm packages installation.

    ```Powershell
    PS C:\Projects\CLAS\MyApp> cd .\MyApp.Web.Client
    PS C:\Projects\CLAS\MyApp\MyApp.Web.Client> yarn install
    ```

## Enable Uiowa Login

1. Update OIDC Credentials in `.\MyApp.Web\config\appsettings*` files
This application is configured to use the Uiowa IDP login providers with OpenID Connect (OIDC). 
Replace `UIOWA-OIDC-TEST-CLIENT-ID` and `UIOWA-OIDC-PROD-CLIENT-ID` with their respective values.

    ```cs
      "UiowaOidc": {
        "Authority": "https://idp-test.uiowa.edu",
        "ClientId": "UIOWA-OIDC-TEST-CLIENT-ID"
      }
    ```

1. Enable Secrets
    ```Powershell
    PS C:\Projects\CLAS\MyApp\MyApp.Web> dotnet user-secrets init
    ```

1. Set UiowaOidc Client Secret value
    ```Powershell
    PS C:\Projects\CLAS\MyApp\MyApp.Web> dotnet user-secrets set "UiowaOIDC:ClientSecret" "{{OIDC TEST SECRET}}"
    ```