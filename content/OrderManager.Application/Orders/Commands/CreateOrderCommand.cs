using System.ComponentModel.DataAnnotations;

namespace OrderManager.Application.Orders;

public record CreateOrderCommand
{
    [MaxLength(100)]
    public string Description { get; init; }
    
    public DateTime CreatedAt { get; } = DateTime.Now;
}