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
        var budget = new Budget
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            CategoryId = dto.CategoryId,
            LimitAmount = dto.LimitAmount,
            Month = dto.Month,
            Year = dto.Year
        };
        _context.Budgets.Add(budget);
        await _context.SaveChangesAsync();
        return budget;
    }

    public async Task<IEnumerable<Budget>> GetBudgetsAsync(Guid userId, int month, int year)
    {
        return await _context.Budgets.Include(b => b.Category)
            .Where(b => b.UserId == userId && b.Month == month && b.Year == year).ToListAsync();
    }

    public async Task<IEnumerable<Budget>> GetUserBudgetsAsync(Guid userId)
    {
        return await _context.Budgets.Include(b => b.Category).Where(b => b.UserId == userId).ToListAsync();
    }
}