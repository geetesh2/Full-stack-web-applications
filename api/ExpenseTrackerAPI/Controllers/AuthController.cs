using ExpenseTrackerAPI.DTOs;
using ExpenseTrackerAPI.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ExpenseTrackerAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController(IAuthService authService) : ControllerBase
{
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] UserDto request)
    {
        var result = await authService.RegisterAsync(request);

        if (!result.Success)
            return BadRequest(new { success = false, message = result.Message });

        return Ok(new { success = true, message = result.Message });
    }


    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] UserDto request)
    {
        var token = await authService.LoginAsync(request);
        if (token == null) return Unauthorized("Invalid credentials");
        return Ok(new { token });
    }
}