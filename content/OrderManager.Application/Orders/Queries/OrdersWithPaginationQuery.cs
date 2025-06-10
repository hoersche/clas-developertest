namespace OrderManager.Application.Orders.Queries;

public class OrdersWithPaginationQuery
{
    public int PageNumber { get; init; } = 1;
    public int PageSize { get; init; } = 10;
}