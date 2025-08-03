using System.Security.Claims;
using ExpenseTrackerAPI.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ExpenseTrackerAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class InsightController(
    IExpenseService expenseService,
    IAiInsightService aiInsightService,
    IBudgetService budgetService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetInsights()
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var expenses = await expenseService.GetUserExpensesAsync(userId);
        var budgets = await budgetService.GetUserBudgetsAsync(userId);
        var enumerable = expenses.ToList();
        if (!enumerable.Any()) return BadRequest("No expenses found for this user.");
        var insights = await aiInsightService.GenerateInsightsFromExpensesAsync(enumerable, budgets);
        return Ok(new { message = "Insights generated successfully", data = insights });
    }
}