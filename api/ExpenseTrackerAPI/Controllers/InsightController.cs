using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ExpenseTrackerAPI.Interfaces;
using System.Security.Claims;

namespace ExpenseTrackerAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class InsightController : ControllerBase
{
    private readonly IExpenseService _expenseService;
    private readonly IAiInsightService _aiInsightService;
    private readonly IBudgetService _budgetService;


    public InsightController(IExpenseService expenseService, IAiInsightService aiInsightService, IBudgetService budgetService)
    {
        _expenseService = expenseService;
        _aiInsightService = aiInsightService;
        _budgetService = budgetService;
    }

    [HttpGet]
    public async Task<IActionResult> GetInsights()
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var expenses = await _expenseService.GetUserExpensesAsync(userId);
        var budgets = await _budgetService.GetUserBudgetsAsync(userId);


        if (!expenses.Any())
        {
            return BadRequest("No expenses found for this user.");
        }

        var insights = await _aiInsightService.GenerateInsightsFromExpensesAsync(expenses, budgets);

        return Ok(new
        {
            message = "Insights generated successfully",
            data = insights
        });
    }
}