using OrderManager.Core.Utils;

namespace OrderManager.Core.Commands;

public class UpdateOrderCommand
{
    public string Description { get; protected set; }

    public UpdateOrderCommand(string description)
    {
        if (description.Length > 100)
        {
            throw new BusinessRuleException("Description should be less than 100 characters.");
        }
        Description = description;
    }
}