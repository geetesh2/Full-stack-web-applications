using ExpenseTrackerAPI.DTOs;
using ExpenseTrackerAPI.Models;

namespace ExpenseTrackerAPI.Interfaces;

public interface IExpenseService
{
    Task<IEnumerable<Expense>> GetUserExpensesAsync(Guid userId);
    Task<Expense?> GetExpenseByIdAsync(Guid expenseId, Guid userId);
    Task<Expense> CreateExpenseAsync(ExpenseDto expenseDto, Guid userId);
    Task<Expense?> UpdateExpenseAsync(Guid expenseId, ExpenseDto expenseDto, Guid userId);
    Task<bool> DeleteExpenseAsync(Guid expenseId, Guid userId);
}