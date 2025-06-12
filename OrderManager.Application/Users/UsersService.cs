using OrderManager.Application.Common;

namespace OrderManager.Application.Users;

public class UsersService
{
    private readonly IUser _currentUser;

    public UsersService(IUser currentUser)
    {
        _currentUser = currentUser;
    }

    public CurrentUserDto GetCurrentUser()
    {
        return new CurrentUserDto
        {
            HawkId = _currentUser.Name,
            UnivId = _currentUser.UnivId,
            OriginalUser = _currentUser.OriginalUser,
            Role = _currentUser.Role
        };
    }
}