using System.Linq.Expressions;
using OrderManager.Core.Models;

namespace OrderManager.Application.Orders;

public record OrderDto
{
    public int Id { get; set; }
    public string Description { get; set; }
    public string CreatedAt { get; set; }
    public string CreatedBy { get; set; }
    

    public static Expression<Func<Order, OrderDto>> FromOrder => x => new OrderDto
    {
        Id = x.Id,
        Description = x.Description,
        CreatedAt = x.CreatedAt.ToString("d"),
        CreatedBy = x.CreatedBy
    };


}