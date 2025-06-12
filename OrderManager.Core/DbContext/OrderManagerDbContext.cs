using Microsoft.EntityFrameworkCore;
using OrderManager.Core.DbContext.EntityTypeConfigurations;
using OrderManager.Core.Models;

namespace OrderManager.Core.DbContext;

public class OrderManagerDbContext : Microsoft.EntityFrameworkCore.DbContext
{
    public OrderManagerDbContext(DbContextOptions<OrderManagerDbContext> options) : base(options)
    {
    }

    public virtual DbSet<Order> Orders { get; protected set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfiguration(new OrderEntityTypeConfiguration());
    }
}