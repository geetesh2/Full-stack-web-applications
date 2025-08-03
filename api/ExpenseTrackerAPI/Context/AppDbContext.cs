using ExpenseTrackerAPI.Models;
using Microsoft.EntityFrameworkCore;
// Required for DbContext, DbSet, DbContextOptions

// Assuming Expense and UserDto are inside a Models folder/namespace

namespace ExpenseTrackerAPI.Context;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Expense> Expenses { get; set; }
    public DbSet<User> Users { get; set; }

    public DbSet<Category> Categories { get; set; }
    
    public DbSet<Budget> Budgets { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Expense>()
            .HasOne(e => e.User)
            .WithMany(u => u.Expenses)
            .HasForeignKey(e => e.UserId)
            .OnDelete(DeleteBehavior.Cascade); // Optional: if user is deleted, delete their expenses

        modelBuilder.Entity<Category>().HasData(
            new Category { Id = Guid.Parse("11111111-1111-1111-1111-111111111111"), Name = "Food" },
            new Category { Id = Guid.Parse("22222222-2222-2222-2222-222222222222"), Name = "Travel" },
            new Category { Id = Guid.Parse("33333333-3333-3333-3333-333333333333"), Name = "Health" },
            new Category { Id = Guid.Parse("44444444-4444-4444-4444-444444444444"), Name = "Shopping" },
            new Category { Id = Guid.Parse("55555555-5555-5555-5555-555555555555"), Name = "Bills" },
            new Category { Id = Guid.Parse("66666666-6666-6666-6666-666666666666"), Name = "Entertainment" },
            new Category { Id = Guid.Parse("77777777-7777-7777-7777-777777777777"), Name = "Education" },
            new Category { Id = Guid.Parse("88888888-8888-8888-8888-888888888888"), Name = "Groceries" },
            new Category { Id = Guid.Parse("99999999-9999-9999-9999-999999999999"), Name = "Fuel" },
            new Category { Id = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"), Name = "Others" }
        );
        
        modelBuilder.Entity<Budget>()
            .HasOne(b => b.User)
            .WithMany()
            .HasForeignKey(b => b.UserId);

        modelBuilder.Entity<Budget>()
            .HasOne(b => b.Category)
            .WithMany()
            .HasForeignKey(b => b.CategoryId);
    }
}