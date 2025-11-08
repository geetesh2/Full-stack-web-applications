using ExpenseTrackerAPI.Context;
using ExpenseTrackerAPI.DTOs;
using ExpenseTrackerAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace ExpenseTrackerAPI.Tests.Services;

public class BudgetServiceTests
{
    private static AppDbContext CreateContext(string dbName)
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(dbName)
            .Options;
        var ctx = new AppDbContext(options);
        ctx.Database.EnsureDeleted();
        ctx.Database.EnsureCreated();
        ctx.Categories.AddRange(
            new Category { Id = Guid.NewGuid(), Name = "Food" },
            new Category { Id = Guid.NewGuid(), Name = "Travel" }
        );
        ctx.SaveChanges();
        return ctx;
    }

    [Fact]
    public async Task CreateBudgetAsync_Succeeds_WhenCategoryExists()
    {
        var ctx = CreateContext(Guid.NewGuid().ToString());
        var userId = Guid.NewGuid();
        ctx.Users.Add(new User { Id = userId, Email = "u@e.com", HashedPassword = "h" });
        await ctx.SaveChangesAsync();

        var svc = new BudgetService(ctx);
        var dto = new BudgetDto { CategoryName = "Food", LimitAmount = 100m, Month = 5, Year = 2025 };

        var created = await svc.CreateBudgetAsync(dto, userId);

        Assert.NotNull(created);
        Assert.Equal(100m, created.LimitAmount);
        Assert.Equal(userId, created.UserId);
    }

    [Fact]
    public async Task CreateBudgetAsync_Throws_WhenCategoryDoesNotExist()
    {
        var ctx = CreateContext(Guid.NewGuid().ToString());
        var svc = new BudgetService(ctx);
        var dto = new BudgetDto { CategoryName = "Nope", LimitAmount = 1m, Month = 1, Year = 2025 };

        await Assert.ThrowsAsync<ArgumentException>(() => svc.CreateBudgetAsync(dto, Guid.NewGuid()));
    }

    [Fact]
    public async Task DeleteBudgetAsync_Removes_WhenExists()
    {
        var ctx = CreateContext(Guid.NewGuid().ToString());
        var userId = Guid.NewGuid();
        var category = ctx.Categories.First();
        var budget = new Budget { Id = Guid.NewGuid(), UserId = userId, CategoryId = category.Id, LimitAmount = 50m, Month = 1, Year = 2025 };
        ctx.Budgets.Add(budget);
        await ctx.SaveChangesAsync();

        var svc = new BudgetService(ctx);
        var result = await svc.DeleteBudgetAsync(budget.Id, userId);
        Assert.True(result);
    }

    [Fact]
    public async Task GetBudgetsAsync_Returns_ForUser()
    {
        var ctx = CreateContext(Guid.NewGuid().ToString());
        var userId = Guid.NewGuid();
        var category = ctx.Categories.First();
        ctx.Budgets.Add(new Budget { Id = Guid.NewGuid(), UserId = userId, CategoryId = category.Id, LimitAmount = 50m, Month = 2, Year = 2025 });
        await ctx.SaveChangesAsync();

        var svc = new BudgetService(ctx);
        var list = await svc.GetBudgetsAsync(userId);
        Assert.Single(list);
    }
}
