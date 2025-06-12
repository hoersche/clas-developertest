using Microsoft.EntityFrameworkCore;
using OrderManager.Application.Common;

namespace OrderManager.Application.Extensions;

public static class PaginatedListExtension
{
    public static Task<PaginatedList<TDestination>> ToPaginatedListAsync<TDestination>(
        this IQueryable<TDestination> queryable, int pageNumber, int pageSize) where TDestination : class
    {
        return PaginatedList<TDestination>.CreateAsync(queryable.AsNoTracking(), pageNumber, pageSize);
    }
}