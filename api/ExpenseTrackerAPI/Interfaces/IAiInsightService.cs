using ExpenseTrackerAPI.Models;

namespace ExpenseTrackerAPI.Interfaces;

public interface IAiInsightService
{
    Task<string> GenerateInsightsFromExpensesAsync(IEnumerable<Expense> expenses, IEnumerable<Budget> budgets);
}