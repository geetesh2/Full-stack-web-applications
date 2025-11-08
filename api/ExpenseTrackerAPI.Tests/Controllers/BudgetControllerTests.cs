using ExpenseTrackerAPI.Controllers;
using ExpenseTrackerAPI.DTOs;
using ExpenseTrackerAPI.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ExpenseTrackerAPI.Tests.Controllers;

public class BudgetControllerTests
{
    private class FakeBudgetService : IBudgetService
    {
        public Task<Budget> CreateBudgetAsync(BudgetDto dto, Guid userId)
        {
            var b = new Budget
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                CategoryId = Guid.NewGuid(),
                LimitAmount = dto.LimitAmount,
                Month = dto.Month,
                Year = dto.Year,
                CreatedAt = DateTime.UtcNow
            };
            return Task.FromResult(b);
        }

        public Task<IEnumerable<Budget>> GetBudgetsAsync(Guid userId)
        {
            var list = new List<Budget>
            {
                new Budget { Id = Guid.NewGuid(), UserId = userId, CategoryId = Guid.NewGuid(), LimitAmount = 50m, Month = 1, Year = 2025 }
            };
            return Task.FromResult<IEnumerable<Budget>>(list);
        }

        // Implement missing interface member
        public Task<IEnumerable<Budget>> GetUserBudgetsAsync(Guid userId)
        {
            var list = new List<Budget>
            {
                new Budget { Id = Guid.NewGuid(), UserId = userId, CategoryId = Guid.NewGuid(), LimitAmount = 20m, Month = 2, Year = 2025 }
            };
            return Task.FromResult<IEnumerable<Budget>>(list);
        }

        public Task<bool> DeleteBudgetAsync(Guid id, Guid userId)
        {
            return Task.FromResult(true);
        }
    }

    private static ControllerContext ControllerContextWithUser(Guid userId)
    {
        var user = new ClaimsPrincipal(new ClaimsIdentity(new[] {
            new Claim(ClaimTypes.NameIdentifier, userId.ToString())
        }, "TestAuth"));

        return new ControllerContext
        {
            HttpContext = new DefaultHttpContext { User = user }
        };
    }

    [Fact]
    public async Task CreateBudget_ReturnsOk_WithCreatedBudget()
    {
        var userId = Guid.NewGuid();
        var svc = new FakeBudgetService();
        var controller = new BudgetController(svc)
        {
            ControllerContext = ControllerContextWithUser(userId)
        };

        var dto = new BudgetDto { CategoryName = "Food", LimitAmount = 100m, Month = 5, Year = 2025 };

        var result = await controller.CreateBudget(dto);
        var ok = Assert.IsType<OkObjectResult>(result);
        Assert.NotNull(ok.Value);
    }

    [Fact]
    public async Task GetMonthlyBudgets_ReturnsOk_WithData()
    {
        var userId = Guid.NewGuid();
        var svc = new FakeBudgetService();
        var controller = new BudgetController(svc)
        {
            ControllerContext = ControllerContextWithUser(userId)
        };

        var result = await controller.GetMonthlyBudgets();
        var ok = Assert.IsType<OkObjectResult>(result);
        Assert.NotNull(ok.Value);
    }

    [Fact]
    public async Task DeleteBudget_ReturnsNoContent_WhenSuccess()
    {
        var userId = Guid.NewGuid();
        var svc = new FakeBudgetService();
        var controller = new BudgetController(svc)
        {
            ControllerContext = ControllerContextWithUser(userId)
        };

        var res = await controller.DeleteBudget(Guid.NewGuid());
        Assert.IsType<NoContentResult>(res);
    }
}
