using System.Security.Claims;
using ExpenseTrackerAPI.Context;
using ExpenseTrackerAPI.DTOs;
using ExpenseTrackerAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ExpenseTrackerAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize] 
public class ExpenseController : ControllerBase
{
    private readonly AppDbContext _context;

    public ExpenseController(AppDbContext context)
    {
        _context = context;
    }

    private Guid GetUserId() => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet("{id:guid}")]
    public async Task<ActionResult> Get(Guid id)
    {
        var userId = GetUserId();

        var expense = await _context.Expenses
            .FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId);

        if (expense == null)
            return NotFound();

        return Ok(expense);
    }

    [HttpGet("me")]
    public async Task<ActionResult<IEnumerable<Expense>>> GetMyExpenses()
    {
        var userId = GetUserId();

        var expenses = await _context.Expenses
            .Where(e => e.UserId == userId)
            .ToListAsync();

        return Ok(expenses);
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Post([FromBody] ExpenseDto dto)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var expense = new Expense
        {
            Id = Guid.NewGuid(),
            ExpenseType = dto.ExpenseType,
            Amount = dto.Amount,
            Description = dto.Description,
            Date = DateTime.SpecifyKind(dto.Date, DateTimeKind.Utc),
            UserId = userId
        };

        _context.Expenses.Add(expense);
        await _context.SaveChangesAsync();

        return Ok(expense); // or map back to a response DTO if needed
    }


    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Put(Guid id, [FromBody] ExpenseDto expense)
    {
        var userId = GetUserId();

        var exists = await _context.Expenses
            .FirstOrDefaultAsync(e => e.Id == id && e.UserId == userId);

        if (exists  == null)
            return NotFound();

        exists.Date = DateTime.SpecifyKind(expense.Date,  DateTimeKind.Utc);
        exists.Description = expense.Description;
        exists.ExpenseType = expense.ExpenseType;
        exists.Amount = expense.Amount;

        _context.Entry(exists).State = EntityState.Modified;
        await _context.SaveChangesAsync();

        return Ok(exists);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var userId = GetUserId();

        var expense = await _context.Expenses
            .FirstOrDefaultAsync(e => e.Id == id && e.UserId == userId);

        if (expense == null)
            return NotFound();

        _context.Expenses.Remove(expense);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
