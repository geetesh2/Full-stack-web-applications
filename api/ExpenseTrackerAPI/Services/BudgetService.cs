using ExpenseTrackerAPI.Context;
using ExpenseTrackerAPI.DTOs;
using ExpenseTrackerAPI.Models;
using Microsoft.EntityFrameworkCore;

public class BudgetService : IBudgetService
{
    private readonly AppDbContext _context;

    public BudgetService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Budget> CreateBudgetAsync(BudgetDto dto, Guid userId)
    {
        var category = await _context.Categories
       .FirstOrDefaultAsync(c => c.Name.ToUpper() == dto.CategoryName.ToUpper());

        if (category == null)
        {
            throw new ArgumentException($"Invalid category name provided: {dto.CategoryName}");
        }

        var budget = new Budget
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            CategoryId = category.Id,
            LimitAmount = dto.LimitAmount,
            Month = dto.Month,
            Year = dto.Year
        };
        _context.Budgets.Add(budget);
        await _context.SaveChangesAsync();
        return budget;
    }

    public async Task<IEnumerable<Budget>> GetBudgetsAsync(Guid userId)
    {
        return await _context.Budgets.Include(b => b.Category)
            .Where(b => b.UserId == userId).ToListAsync();
    }

    public async Task<IEnumerable<Budget>> GetUserBudgetsAsync(Guid userId)
    {
        return await _context.Budgets.Include(b => b.Category).Where(b => b.UserId == userId).ToListAsync();
    }
}