using ExpenseTrackerAPI.Context;
using ExpenseTrackerAPI.DTOs;
using ExpenseTrackerAPI.Interfaces;
using ExpenseTrackerAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace ExpenseTrackerAPI.Services;

public class ExpenseService : IExpenseService
{
    private readonly AppDbContext _context;

    public ExpenseService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Expense>> GetUserExpensesAsync(Guid userId)
    {
        return await _context.Expenses.Where(e => e.UserId == userId).Include(e => e.Category).ToListAsync();
    }

    public async Task<Expense?> GetExpenseByIdAsync(Guid expenseId, Guid userId)
    {
        return await _context.Expenses.FirstOrDefaultAsync(x => x.Id == expenseId && x.UserId == userId);
    }

    public async Task<Expense> CreateExpenseAsync(ExpenseDto dto, Guid userId)
    {
        var category = await _context.Categories
        .FirstOrDefaultAsync(c => c.Name.ToUpper() == dto.CategoryName.ToUpper());

        if (category == null)
        {
            throw new ArgumentException($"Invalid category name provided: {dto.CategoryName}");
        }

        var expense = new Expense
        {
            Id = Guid.NewGuid(),
            CategoryId = category.Id,
            Amount = dto.Amount,
            Description = dto.Description,
            Date = DateTime.SpecifyKind(dto.Date, DateTimeKind.Utc),
            UserId = userId
        };
        _context.Expenses.Add(expense);
        await _context.SaveChangesAsync();
        return expense;
    }

    public async Task<Expense?> UpdateExpenseAsync(Guid expenseId, ExpenseDto dto, Guid userId)
    {
        var category = await _context.Categories
        .FirstOrDefaultAsync(c => c.Name.ToUpper() == dto.CategoryName.ToUpper());

        if (category == null)
        {
            throw new ArgumentException($"Invalid category name provided: {dto.CategoryName}");
        }
        var existingExpense = await _context.Expenses.FirstOrDefaultAsync(e => e.Id == expenseId && e.UserId == userId);
        if (existingExpense == null) return null;
        existingExpense.Date = DateTime.SpecifyKind(dto.Date, DateTimeKind.Utc);
        existingExpense.Description = dto.Description;
        existingExpense.CategoryId = category.Id;
        existingExpense.Amount = dto.Amount;
        await _context.SaveChangesAsync();
        return existingExpense;
    }

    public async Task<bool> DeleteExpenseAsync(Guid expenseId, Guid userId)
    {
        var expense = await _context.Expenses.FirstOrDefaultAsync(e => e.Id == expenseId && e.UserId == userId);
        if (expense == null) return false;
        _context.Expenses.Remove(expense);
        await _context.SaveChangesAsync();
        return true;
    }
}