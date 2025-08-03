using ExpenseTrackerAPI.DTOs;
using ExpenseTrackerAPI.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ExpenseTrackerAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class BudgetController : ControllerBase
{
    private readonly IBudgetService _budgetService;

    public BudgetController(IBudgetService budgetService)
    {
        _budgetService = budgetService;
    }

    private Guid GetUserId() =>
        Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpPost]
    public async Task<IActionResult> CreateBudget([FromBody] BudgetDto dto)
    {
        var userId = GetUserId();
        var budget = await _budgetService.CreateBudgetAsync(dto, userId);
        return Ok(new { message = "Budget added successfully", data = budget });
    }

    [HttpGet("monthly")]
    public async Task<IActionResult> GetMonthlyBudgets([FromQuery] int month, [FromQuery] int year)
    {
        var userId = GetUserId();
        var budgets = await _budgetService.GetBudgetsAsync(userId, month, year);
        return Ok(new { data = budgets });
    }
}