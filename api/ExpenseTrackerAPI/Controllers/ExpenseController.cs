using System.Security.Claims;
using ExpenseTrackerAPI.DTOs;
using ExpenseTrackerAPI.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ExpenseTrackerAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ExpenseController(IExpenseService expenseService) : ControllerBase
{
    private Guid GetUserId()
    {
        return Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult> Get(Guid id)
    {
        var expense = await expenseService.GetExpenseByIdAsync(id, GetUserId());
        return expense == null ? NotFound() : Ok(expense);
    }

    [HttpGet("me")]
    public async Task<ActionResult> GetMyExpenses()
    {
        var expenses = await expenseService.GetUserExpensesAsync(GetUserId());
        return Ok(expenses);
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] ExpenseDto dto)
    {
        Console.WriteLine(dto);
        var newExpense = await expenseService.CreateExpenseAsync(dto, GetUserId());
        return Ok(newExpense);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Put(Guid id, [FromBody] ExpenseDto dto)
    {
        var updatedExpense = await expenseService.UpdateExpenseAsync(id, dto, GetUserId());
        return updatedExpense == null ? NotFound() : Ok(updatedExpense);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var success = await expenseService.DeleteExpenseAsync(id, GetUserId());
        return success ? NoContent() : NotFound();
    }
}