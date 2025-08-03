using System.ComponentModel.DataAnnotations;

namespace ExpenseTrackerAPI.Models;

public class Budget
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public Guid CategoryId { get; set; }
    public Category Category { get; set; } = null!;

    public decimal LimitAmount { get; set; }

    [Range(1, 12)]
    public int Month { get; set; }

    public int Year { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}