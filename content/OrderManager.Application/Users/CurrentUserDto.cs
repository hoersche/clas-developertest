namespace OrderManager.Application.Users;

public class CurrentUserDto
{
    public required string? HawkId { get; set; }
    public required string? UnivId { get; set; }
    public required string? OriginalUser { get; set; }
    public required string? Role { get; set; }
}