using ExpenseTrackerAPI.Context;
using ExpenseTrackerAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ExpenseTrackerAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ExpenseController : ControllerBase
{
    private readonly AppDbContext _context;

    public ExpenseController(AppDbContext context)
    {
        _context = context;
    }
    
    [HttpGet("{id:guid}")]
    public async Task<ActionResult> Get(Guid id)
    {
        return Ok(await _context.Expenses.Where(x => x.Id == id).FirstOrDefaultAsync());
    }

    [HttpPost]
    public async Task<ActionResult> Post([FromBody] Expense expense)
    {
        expense.Date = DateTime.SpecifyKind(expense.Date, DateTimeKind.Utc);

        _context.Expenses.Add(expense);
        await _context.SaveChangesAsync();
        return Ok(expense);
    }

    [HttpGet]
    [Authorize]
    public async Task<ActionResult<IEnumerable<Expense>>> GetAll()
    {
        return Ok(await _context.Expenses.ToListAsync());
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Put(Guid id, [FromBody] Expense expense)
    {
        if (id != expense.Id)
            return BadRequest("ID mismatch");

        var exists = await _context.Expenses.AnyAsync(e => e.Id == id);
        if (!exists)
            return NotFound();

        _context.Entry(expense).State = EntityState.Modified;
        await _context.SaveChangesAsync();

        return NoContent(); 
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var expense = await _context.Expenses.FindAsync(id);
        if (expense == null)
            return NotFound();

        _context.Expenses.Remove(expense);
        await _context.SaveChangesAsync();

        return NoContent(); 
    }
    
    [HttpGet("user/{userId:guid}")]
    public async Task<ActionResult<IEnumerable<Expense>>> GetByUser(Guid userId)
    {
        var expenses = await _context.Expenses
            .Where(e => e.UserId == userId)
            .ToListAsync();

        return Ok(expenses);
    }

}