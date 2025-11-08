using ExpenseTrackerAPI.Context;
using ExpenseTrackerAPI.DTOs;
using ExpenseTrackerAPI.Models;
using ExpenseTrackerAPI.Services;
using Microsoft.EntityFrameworkCore;

namespace ExpenseTrackerAPI.Tests.Services;

public class ExpenseServiceTests
{
    private static AppDbContext CreateContext(string dbName)
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(dbName)
            .Options;
        var ctx = new AppDbContext(options);
        // ensure database is created
        ctx.Database.EnsureDeleted();
        ctx.Database.EnsureCreated();
        // seed categories
        ctx.Categories.AddRange(
            new Category { Id = Guid.NewGuid(), Name = "Food" },
            new Category { Id = Guid.NewGuid(), Name = "Travel" }
        );
        ctx.SaveChanges();
        return ctx;
    }

    [Fact]
    public async Task CreateExpenseAsync_Succeeds_WhenCategoryExists()
    {
        var ctx = CreateContext(Guid.NewGuid().ToString());
        var userId = Guid.NewGuid();
        ctx.Users.Add(new User { Id = userId, Email = "a@b.com", HashedPassword = "hash" });
        await ctx.SaveChangesAsync();

        var svc = new ExpenseService(ctx);
        var dto = new ExpenseDto { CategoryName = "Food", Amount = 12.5m, Date = DateTime.UtcNow, Description = "Lunch" };

        var created = await svc.CreateExpenseAsync(dto, userId);

        Assert.NotNull(created);
        Assert.Equal(12.5m, created.Amount);
        Assert.Equal(userId, created.UserId);
        Assert.Equal(dto.Description, created.Description);

        var inDb = ctx.Expenses.FirstOrDefault(e => e.Id == created.Id);
        Assert.NotNull(inDb);
    }

    [Fact]
    public async Task CreateExpenseAsync_Throws_WhenCategoryDoesNotExist()
    {
        var ctx = CreateContext(Guid.NewGuid().ToString());
        var svc = new ExpenseService(ctx);
        var dto = new ExpenseDto { CategoryName = "NonExist", Amount = 1m, Date = DateTime.UtcNow };

        await Assert.ThrowsAsync<ArgumentException>(() => svc.CreateExpenseAsync(dto, Guid.NewGuid()));
    }

    [Fact]
    public async Task GetUserExpensesAsync_ReturnsExpenses_ForUser()
    {
        var ctx = CreateContext(Guid.NewGuid().ToString());
        var userId = Guid.NewGuid();
        var category = ctx.Categories.First();
        var expense = new Expense { Id = Guid.NewGuid(), Amount = 5m, CategoryId = category.Id, Date = DateTime.UtcNow, UserId = userId };
        ctx.Expenses.Add(expense);
        await ctx.SaveChangesAsync();

        var svc = new ExpenseService(ctx);
        var list = await svc.GetUserExpensesAsync(userId);
        Assert.Single(list);
    }

    [Fact]
    public async Task UpdateExpenseAsync_Updates_WhenExists()
    {
        var ctx = CreateContext(Guid.NewGuid().ToString());
        var userId = Guid.NewGuid();
        var category = ctx.Categories.First();
        var secondCategory = ctx.Categories.Skip(1).First();
        var expense = new Expense { Id = Guid.NewGuid(), Amount = 5m, CategoryId = category.Id, Date = DateTime.UtcNow, UserId = userId, Description = "old" };
        ctx.Expenses.Add(expense);
        await ctx.SaveChangesAsync();

        var svc = new ExpenseService(ctx);
        var dto = new ExpenseDto { CategoryName = secondCategory.Name, Amount = 10m, Date = DateTime.UtcNow, Description = "new" };

        var updated = await svc.UpdateExpenseAsync(expense.Id, dto, userId);
        Assert.NotNull(updated);
        Assert.Equal(10m, updated!.Amount);
        Assert.Equal(dto.Description, updated.Description);
        Assert.Equal(secondCategory.Id, updated.CategoryId);
    }

    [Fact]
    public async Task DeleteExpenseAsync_Removes_WhenExists()
    {
        var ctx = CreateContext(Guid.NewGuid().ToString());
        var userId = Guid.NewGuid();
        var category = ctx.Categories.First();
        var expense = new Expense { Id = Guid.NewGuid(), Amount = 5m, CategoryId = category.Id, Date = DateTime.UtcNow, UserId = userId };
        ctx.Expenses.Add(expense);
        await ctx.SaveChangesAsync();

        var svc = new ExpenseService(ctx);
        var result = await svc.DeleteExpenseAsync(expense.Id, userId);
        Assert.True(result);
        Assert.Empty(ctx.Expenses.Where(e => e.Id == expense.Id));
    }
}
