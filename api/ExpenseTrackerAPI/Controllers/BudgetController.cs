using ExpenseTrackerAPI.DTOs;
using ExpenseTrackerAPI.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ExpenseTrackerAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class BudgetController(IBudgetService budgetService) : ControllerBase
{
    private Guid GetUserId() => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpPost]
    public async Task<IActionResult> CreateBudget([FromBody] BudgetDto dto)
    {
        var userId = GetUserId();
        var budget = await budgetService.CreateBudgetAsync(dto, userId);
        return Ok(new { message = "Budget added successfully", data = budget });
    }

    [HttpGet]
    public async Task<IActionResult> GetMonthlyBudgets()
    {
        var userId = GetUserId();
        var budgets = await budgetService.GetBudgetsAsync(userId);
        return Ok(new { data = budgets });
    }
}