using System;

namespace OrderManager.Core.Utils;

[Serializable]
public class BusinessRuleException : Exception
{
    public string? Field { get; set; }
    public BusinessRuleException(string msg) : base(msg)
    {
    }

    public BusinessRuleException(string field, string msg) : base(msg)
    {
        Field = field;
    }
}