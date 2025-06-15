using System;

namespace OrderManager.Core.Models;

public class Order
{
    public int Id { get; protected set; }
    public required string Description { get; set; }
    public DateTime CreatedAt { get; set; }
    public required string CreatedBy { get; set; }

    // JAG
    /// TODO: Not sure what this is trying to accomplish since it appears to be a placeholder
    /// further requirements are necessary to try to understand the intention of this method.
    /// may need to add to database.
    public bool IsSystemGenerated()
    {
        return false;
    }
}