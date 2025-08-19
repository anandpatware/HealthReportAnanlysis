using Microsoft.AspNetCore.Mvc;
using FirebaseAdmin.Auth;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    [HttpPost("register")]
    public async Task<IActionResult> Register()
    {
        string token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
        var decodedToken = await FirebaseAuth.DefaultInstance.VerifyIdTokenAsync(token);

        // Save user info into your database if needed
        return Ok(new { message = "User registered in backend." });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login()
    {
        string token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
        var decodedToken = await FirebaseAuth.DefaultInstance.VerifyIdTokenAsync(token);

        // Only allow if user exists in DB
        return Ok(new { message = "User login verified." });
    }
}
