using ExpenseTrackerAPI.DTOs;
using Microsoft.EntityFrameworkCore; // Required for DbContext, DbSet, DbContextOptions
using ExpenseTrackerAPI.Models; // Assuming Expense and UserDto are inside a Models folder/namespace

namespace ExpenseTrackerAPI.Context
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Expense> Expenses { get; set; }
        public DbSet<User> Users { get; set; }
    }
}