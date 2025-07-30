using ExpenseTrackerAPI.DTOs;
using ExpenseTrackerAPI.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ExpenseTrackerAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] UserDto request)
    {
        var result = await _authService.RegisterAsync(request);

        if (!result.Success) return BadRequest(result.Message);

        return Ok(result.Message);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] UserDto request)
    {
        var token = await _authService.LoginAsync(request);

        if (token == null) return Unauthorized("Invalid credentials");

        return Ok(new { token });
    }
}