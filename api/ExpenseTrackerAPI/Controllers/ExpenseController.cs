using System.Security.Claims;
using ExpenseTrackerAPI.DTOs;
using ExpenseTrackerAPI.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ExpenseTrackerAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ExpenseController : ControllerBase
{
    private readonly IExpenseService _expenseService;

    public ExpenseController(IExpenseService expenseService)
    {
        _expenseService = expenseService;
    }

    private Guid GetUserId() => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet("{id:guid}")]
    public async Task<ActionResult> Get(Guid id)
    {
        var expense = await _expenseService.GetExpenseByIdAsync(id, GetUserId());
        return expense == null ? NotFound() : Ok(expense);
    }

    [HttpGet("me")]
    public async Task<ActionResult> GetMyExpenses()
    {
        var expenses = await _expenseService.GetUserExpensesAsync(GetUserId());
        return Ok(expenses);
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] ExpenseDto dto)
    {
        Console.WriteLine(dto);
        var newExpense = await _expenseService.CreateExpenseAsync(dto, GetUserId());
        return Ok(newExpense);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Put(Guid id, [FromBody] ExpenseDto dto)
    {
        var updatedExpense = await _expenseService.UpdateExpenseAsync(id, dto, GetUserId());
        return updatedExpense == null ? NotFound() : Ok(updatedExpense);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var success = await _expenseService.DeleteExpenseAsync(id, GetUserId());
        return success ? NoContent() : NotFound();
    }
}