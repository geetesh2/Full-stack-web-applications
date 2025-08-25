using ExpenseTrackerAPI.DTOs;
using ExpenseTrackerAPI.Models;

public interface IBudgetService
{
    Task<Budget> CreateBudgetAsync(BudgetDto dto, Guid userId);
    Task<bool> DeleteBudgetAsync(Guid id, Guid guid);
    Task<IEnumerable<Budget>> GetBudgetsAsync(Guid userId);
    Task<IEnumerable<Budget>> GetUserBudgetsAsync(Guid userId);

}