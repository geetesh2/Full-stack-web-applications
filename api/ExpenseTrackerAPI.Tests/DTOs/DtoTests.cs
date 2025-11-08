using ExpenseTrackerAPI.DTOs;
using System;
using Xunit;

namespace ExpenseTrackerAPI.Tests.DTOs;

public class DtoTests
{
    [Fact]
    public void UserDto_AllowsPropertySetting()
    {
        var dto = new UserDto { Email = "a@b.com", Password = "p" };
        Assert.Equal("a@b.com", dto.Email);
        Assert.Equal("p", dto.Password);
    }

    [Fact]
    public void ExpenseDto_AllowsPropertySetting()
    {
        var now = DateTime.UtcNow;
        var dto = new ExpenseDto { CategoryName = "Food", Amount = 10.5m, Date = now, Description = "x" };
        Assert.Equal("Food", dto.CategoryName);
        Assert.Equal(10.5m, dto.Amount);
        Assert.Equal(now, dto.Date);
        Assert.Equal("x", dto.Description);
    }

    [Fact]
    public void BudgetDto_AllowsPropertySetting()
    {
        var dto = new BudgetDto { CategoryName = "Travel", LimitAmount = 200m, Month = 6, Year = 2025 };
        Assert.Equal("Travel", dto.CategoryName);
        Assert.Equal(200m, dto.LimitAmount);
        Assert.Equal(6, dto.Month);
        Assert.Equal(2025, dto.Year);
    }
}
