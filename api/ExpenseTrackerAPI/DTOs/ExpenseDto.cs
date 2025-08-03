using ExpenseTrackerAPI.Models;

namespace ExpenseTrackerAPI.DTOs;

public class ExpenseDto
{
    public Guid CategoryId { get; set; }
    public decimal Amount { get; set; }
    public string? Description { get; set; }
    public DateTime Date { get; set; }
}