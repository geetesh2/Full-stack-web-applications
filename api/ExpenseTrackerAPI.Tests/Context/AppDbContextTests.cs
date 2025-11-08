using ExpenseTrackerAPI.Context;
using ExpenseTrackerAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace ExpenseTrackerAPI.Tests.Context;

public class AppDbContextTests
{
    private static AppDbContext CreateContext(string dbName)
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(dbName)
            .Options;
        var ctx = new AppDbContext(options);
        ctx.Database.EnsureDeleted();
        ctx.Database.EnsureCreated();
        return ctx;
    }

    [Fact]
    public void CanAddAndQueryCategory()
    {
        var ctx = CreateContext(Guid.NewGuid().ToString());
        var cat = new Category { Id = Guid.NewGuid(), Name = "TestCat" };
        ctx.Categories.Add(cat);
        ctx.SaveChanges();

        var inDb = ctx.Categories.FirstOrDefault(c => c.Name == "TestCat");
        Assert.NotNull(inDb);
    }

    [Fact]
    public void CanAddUserAndExpense_RelationshipsWork()
    {
        var ctx = CreateContext(Guid.NewGuid().ToString());
        var user = new User { Id = Guid.NewGuid(), Email = "u@e.com", HashedPassword = "h", CreatedAt = DateTime.UtcNow };
        ctx.Users.Add(user);
        var cat = new Category { Id = Guid.NewGuid(), Name = "Food" };
        ctx.Categories.Add(cat);
        ctx.SaveChanges();

        var exp = new Expense { Id = Guid.NewGuid(), UserId = user.Id, CategoryId = cat.Id, Amount = 9.99m, Date = DateTime.UtcNow };
        ctx.Expenses.Add(exp);
        ctx.SaveChanges();

        var fetched = ctx.Expenses.Include(e => e.Category).Include(e => e.User).FirstOrDefault(e => e.Id == exp.Id);
        Assert.NotNull(fetched);
        Assert.Equal(user.Id, fetched!.UserId);
        Assert.Equal(cat.Id, fetched.CategoryId);
    }
}
