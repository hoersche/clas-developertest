using System;

namespace OrderManager.Core.Models;

public class Order
{
    public int Id { get; protected set; }
    public required string Description { get; set; }
    public DateTime CreatedAt { get; set; }
    public required string CreatedBy { get; set; }

    public bool IsSystemGenerated()
    {
        return false;
    }
}