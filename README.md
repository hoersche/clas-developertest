# FBIS Web Application Template

## Template Application: OrderManager

It is a sample web application based on .NET Core and Angular.

**Features**:
* Angular CLI
* Bootstrap 5, font-awesome 6.4
* Webpage layout with UIowa header, footer
* Angular modules, routes, services, components examples
* .NET Core web app SetUp
* EF Core SQL DbContext setup
* Swagger
* Serilog
* UiowaHawkIdUIP Login
* SPA service setup
* Web API examples
* ...

## Template Development
To test locally you can install the template locally by running the following comamnd in the root of the project

```Powershell
dotnet new install .
```

## Template Installation

Install Template Nuget (this step is need for first time usage)

```Powershell
dotnet new -i ClasWeb
```

Update Template Dotnet core 6

```Powershell
dotnet new --update-check
dotnet new --update-apply
```

Update Template Dotnet Core 7+
```Powershell
dotnet new update --check
dotnet new update
```

## Create a new solution

1. Make a solution folder, then change directory into it, create a new FBIS Web solution. eg,

```Powershell
PS C:\Projects> mkdir MyApp
PS C:\Projects> cd .\MyApp\
PS C:\Projects\MyApp> dotnet new ClasWeb
The template "CLAS Web Application" was created successfully.
```

1. Change directory to the web project, install npm packages. This step will take about 2 minutes for npm packages installation.

```Powershell
PS C:\Projects\MyApp> cd .\MyApp.Web.Client
PS C:\Projects\MyApp\MyApp.Web.Client\Angular> yarn install
```

1. (Optional) Database Migration (Entity Framework Core)
... In Visual Studio, issue below command to migrate database for the sample app.

```Powershell
update-database
```

## Optional Parameters
 * productionServer - sets the production server name
 * testServer - sets the test server name
 
```Powershell
PS C:\Projects\clas\MyApp> dotnet new clasweb --productionServer itsnt2351 --testServer itsnt2328
The template "CLAS Web Application" was created successfully.
```
