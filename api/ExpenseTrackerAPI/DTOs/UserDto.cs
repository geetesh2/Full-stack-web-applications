using System.ComponentModel.DataAnnotations;

namespace ExpenseTrackerAPI.DTOs;

public class UserDto
{
    [EmailAddress]
    public string Email { get; set; }
    public string Password { get; set; }
}