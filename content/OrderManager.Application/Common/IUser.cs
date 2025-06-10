namespace OrderManager.Application.Common;

public interface IUser
{
    public string? Name { get; }
    public string? UnivId { get; }
    public string? OriginalUser { get; }
    public string? Role { get;  }
}