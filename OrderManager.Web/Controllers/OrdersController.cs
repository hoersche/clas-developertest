using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using OrderManager.Application.Common;
using OrderManager.Application.Orders;
using OrderManager.Application.Orders.Queries;
using CreateOrderCommand = OrderManager.Application.Orders.CreateOrderCommand;

namespace OrderManager.Web.Controllers;

[Route("api/[controller]")]
[ApiController]
public class OrdersController : ControllerBase
{
    private readonly OrdersService _ordersService;

    public OrdersController(OrdersService ordersService)
    {
        _ordersService = ordersService;
    }

    [HttpGet]
    public async Task<ActionResult<PaginatedList<OrderDto>>> Get([FromQuery] OrdersWithPaginationQuery query)
    {
        return await _ordersService.GetOrders(query);
    }

    [HttpPost("")]
    public async Task<CreatedResult> Create([FromBody] CreateOrderCommand command)
    {
        var orderId = await _ordersService.CreateOrder(command);
        return Created("api/orders/{orderId}", orderId);
    }

    [HttpDelete("{id:int}")]
    public async Task<NoContentResult> Delete(int id)
    {
        await _ordersService.DeleteOrder(id);
        return NoContent();
    }
}