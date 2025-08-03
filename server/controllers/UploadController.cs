using Microsoft.AspNetCore.Mvc;
using System.Text;
using System.Text.Json;
using Tesseract;
using PdfSharp.Pdf.IO;
using UglyToad.PdfPig;

[Route("api/[controller]")]
[ApiController]
public class ClaudeApiController : ControllerBase
{
    private readonly IHttpClientFactory _httpClientFactory;
    private const string API_KEY = "apikey"; // Replace this with your actual key

    public ClaudeApiController(IHttpClientFactory httpClientFactory)
    {
        _httpClientFactory = httpClientFactory;
    }

    [HttpPost("ask")]
    public async Task<IActionResult> AskCohere([FromBody] ClaudeRequest request)
    {
        var client = _httpClientFactory.CreateClient();

        client.DefaultRequestHeaders.Add("Authorization", $"Bearer {"p1QkYu5DJlKk5GX8qZxhia0CB8ihaWA8f4S5X0bO"}");

        var requestBody = new
        {
            model = "command-r-plus",
            temperature = 0.5,
            max_tokens = 1024,
            chat_history = new object[] { },
            message = request.Content,
            connectors = new object[] { }
        };

        var httpContent = new StringContent(
            JsonSerializer.Serialize(requestBody),
            Encoding.UTF8,
            "application/json"
        );

        var response = await client.PostAsync("https://api.cohere.ai/v1/chat", httpContent);
        var result = await response.Content.ReadAsStringAsync();

        if (response.IsSuccessStatusCode)
        {
            return Ok(JsonDocument.Parse(result));
        }
        else
        {
            return StatusCode((int)response.StatusCode, result);
        }
    }


    [HttpPost("ask-from-file")]
    public async Task<IActionResult> AskFromFile(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("File is empty.");

        string extractedText;
        var extension = Path.GetExtension(file.FileName).ToLower();
        var client = _httpClientFactory.CreateClient();

        using var stream = file.OpenReadStream();

        if (extension == ".pdf")
        {
            using var pdfStream = file.OpenReadStream();
            extractedText = ExtractTextFromPdf(pdfStream) + "\nAnalyse the report and tell me about the contents in report";
        }
        else if (extension == ".jpg" || extension == ".png")
        {
            var tempPath = Path.GetTempFileName();
            try
            {
                // Save uploaded image to temp file
                using (var fs = new FileStream(tempPath, FileMode.Create, FileAccess.Write))
                {
                    await stream.CopyToAsync(fs);
                }

                extractedText = ExtractTextFromImage(tempPath) + "\nAnalyse the report and tell me the issues in the report.";
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Image processing failed: {ex.Message}");
            }
            finally
            {
                // Cleanup
                if (System.IO.File.Exists(tempPath))
                    System.IO.File.Delete(tempPath);
            }
        }
        else
        {
            return BadRequest("Unsupported file format.");
        }

        client.DefaultRequestHeaders.Add("Authorization", "Bearer p1QkYu5DJlKk5GX8qZxhia0CB8ihaWA8f4S5X0bO");

        var requestBody = new
        {
            model = "command-r-plus",
            temperature = 0.5,
            max_tokens = 1024,
            chat_history = new object[] { },
            message = extractedText,
            connectors = new object[] { }
        };

        var httpContent = new StringContent(
            JsonSerializer.Serialize(requestBody),
            Encoding.UTF8,
            "application/json"
        );

        var response = await client.PostAsync("https://api.cohere.ai/v1/chat", httpContent);
        var result = await response.Content.ReadAsStringAsync();

        if (response.IsSuccessStatusCode)
        {
            return Ok(JsonDocument.Parse(result));
        }
        else
        {
            return StatusCode((int)response.StatusCode, result);
        }
    }



    // Example: extract text from a PDF
    // string ExtractTextFromPdf(string filePath)
    // {
    //     using var reader = PdfReader.Open(filePath, PdfDocumentOpenMode.ReadOnly);
    //     StringBuilder text = new();

    //     foreach (var page in reader.Pages)
    //     {
    //         text.Append(page.Contents.ToString());
    //     }

    //     return text.ToString();
    // }




    [HttpPost("upload")]
    public async Task<IActionResult> UploadFile(IFormFile file, [FromForm] string prompt)
    {
        if (file == null || file.Length == 0)
            return BadRequest("No file uploaded");

        string extractedText;

        using (var memoryStream = new MemoryStream())
        {
            await file.CopyToAsync(memoryStream);
            var fileBytes = memoryStream.ToArray();

            var fileName = file.FileName.ToLower();
            if (fileName.EndsWith(".pdf"))
            {
                // extractedText = ExtractTextFromPdf(fileBytes); // implement this
            }
            else if (fileName.EndsWith(".png") || fileName.EndsWith(".jpg") || fileName.EndsWith(".jpeg"))
            {
                extractedText = ExtractTextFromImage(fileBytes); // implement this
            }
            else
            {
                return BadRequest("Unsupported file type");
            }
        }

        // Send to Claude for analysis
        //    var analysis = await SendToClaude(extractedText, prompt);
        return Ok();
    }

    private async Task<string> SendToClaude(string content, string prompt)
    {
        var client = _httpClientFactory.CreateClient();
        client.DefaultRequestHeaders.Add("x-api-key", API_KEY);
        client.DefaultRequestHeaders.Add("anthropic-version", "2023-06-01");

        var combinedPrompt = $"{prompt}\n\nExtracted Text:\n{content}";

        var requestBody = new
        {
            model = "claude-3-5-sonnet-20241022",
            max_tokens = 8192,
            messages = new[]
            {
        new { role = "user", content = combinedPrompt }
    }
        };


        var httpContent = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");

        var response = await client.PostAsync("https://api.anthropic.com/v1/messages", httpContent);
        var result = await response.Content.ReadAsStringAsync();

        if (response.IsSuccessStatusCode)
        {
            return result;
        }
        else
        {
            throw new Exception($"Claude API failed: {result}");
        }
    }

    // private string ExtractTextFromPdf(byte[] fileBytes)
    // {
    //     var text = new StringBuilder();
    //     using (var memoryStream = new MemoryStream(fileBytes))
    //     using (var document = UglyToad.PdfPig.PdfDocument.Open(memoryStream))
    //     {
    //         foreach (var page in document.GetPages())
    //         {
    //             text.AppendLine(page.Text);
    //         }
    //     }
    //     return text.ToString();
    // }
    private string ExtractTextFromImage(byte[] fileBytes)
    {
        string tessDataPath = Path.Combine(AppContext.BaseDirectory, "tessdata");
        using (var engine = new TesseractEngine(tessDataPath, "eng", EngineMode.Default))
        using (var img = Pix.LoadFromMemory(fileBytes))
        using (var page = engine.Process(img))
        {
            return page.GetText();
        }
    }

    string ExtractTextFromImage(string imagePath)
    {
        using var engine = new TesseractEngine(@"./tessdata", "eng", EngineMode.Default);
        using var img = Pix.LoadFromFile(imagePath);
        using var page = engine.Process(img);
        return page.GetText();
    }

    private string ExtractTextFromPdf(Stream pdfStream)
    {
        var sb = new StringBuilder();

        using (var document = UglyToad.PdfPig.PdfDocument.Open(pdfStream))
        {
            foreach (var page in document.GetPages())
            {
                sb.AppendLine(page.Text);
            }
        }

        return sb.ToString();
    }
}