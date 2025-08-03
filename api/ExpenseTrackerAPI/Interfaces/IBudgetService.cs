using ExpenseTrackerAPI.DTOs;
using ExpenseTrackerAPI.Models;

public interface IBudgetService
{
    Task<Budget> CreateBudgetAsync(BudgetDto dto, Guid userId);
    Task<IEnumerable<Budget>> GetBudgetsAsync(Guid userId, int month, int year);
    Task<IEnumerable<Budget>> GetUserBudgetsAsync(Guid userId);

}