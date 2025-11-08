using ExpenseTrackerAPI.Context;
using ExpenseTrackerAPI.DTOs;
using ExpenseTrackerAPI.Models;
using ExpenseTrackerAPI.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace ExpenseTrackerAPI.Tests.Services;

public class AuthServiceTests
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
    public async Task RegisterAsync_CreatesUser()
    {
        var ctx = CreateContext(Guid.NewGuid().ToString());
        var inMemorySettings = new System.Collections.Generic.Dictionary<string, string> {
            {"Jwt:Key", "test_key_1234567890123456"}, {"Jwt:Issuer", "test"}, {"Jwt:Audience", "test"}
        };
        IConfiguration config = new ConfigurationBuilder().AddInMemoryCollection(inMemorySettings).Build();
        var svc = new AuthService(ctx, config);

        var res = await svc.RegisterAsync(new UserDto { Email = "x@y.com", Password = "pass" });
        Assert.True(res.Success);
        Assert.Equal("User registered successfully", res.Message);
        Assert.Single(ctx.Users);
    }

    [Fact]
    public async Task LoginAsync_ReturnsToken_WhenCredentialsValid()
    {
        var ctx = CreateContext(Guid.NewGuid().ToString());
        var password = "secret";
        var hashed = BCrypt.Net.BCrypt.HashPassword(password);
        var user = new User { Id = Guid.NewGuid(), Email = "t@t.com", HashedPassword = hashed, CreatedAt = DateTime.UtcNow };
        ctx.Users.Add(user);
        await ctx.SaveChangesAsync();

        var inMemorySettings = new System.Collections.Generic.Dictionary<string, string> {
            {"Jwt:Key", "test_key_12345678901234567890123456789012345"}, {"Jwt:Issuer", "test"}, {"Jwt:Audience", "test"}
        };
        IConfiguration config = new ConfigurationBuilder().AddInMemoryCollection(inMemorySettings).Build();
        var svc = new AuthService(ctx, config);

        var token = await svc.LoginAsync(new UserDto { Email = "t@t.com", Password = password });
        Assert.NotNull(token);
    }

    [Fact]
    public async Task LoginAsync_ReturnsNull_WhenInvalid()
    {
        var ctx = CreateContext(Guid.NewGuid().ToString());
        var inMemorySettings = new System.Collections.Generic.Dictionary<string, string> {
            {"Jwt:Key", "test_key_1234567890123456"}, {"Jwt:Issuer", "test"}, {"Jwt:Audience", "test"}
        };
        IConfiguration config = new ConfigurationBuilder().AddInMemoryCollection(inMemorySettings).Build();
        var svc = new AuthService(ctx, config);

        var token = await svc.LoginAsync(new UserDto { Email = "no@no.com", Password = "x" });
        Assert.Null(token);
    }
}
