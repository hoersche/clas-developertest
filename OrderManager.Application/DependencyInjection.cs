using Microsoft.Extensions.DependencyInjection;
using OrderManager.Application.Orders;
using OrderManager.Application.Users;

namespace OrderManager.Application;

public static class DependencyInjection
{
    public static void AddApplicationLayer(this IServiceCollection services)
    {
        services.AddTransient<OrdersService>();
        services.AddTransient<UsersService>();
    }
}