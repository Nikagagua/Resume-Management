using System.Diagnostics;
using AutoMapper;
using backend.Core.Context;
using backend.Core.Dtos.Candidate;
using backend.Core.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[Route("api/[controller]")]
public class CandidateController : ControllerBase
{
    public CandidateController(ResumeManagementDbContext context, IMapper mapper)
    {
        Context = context;
        Mapper = mapper;
    }

    private ResumeManagementDbContext Context { get; }
    private IMapper Mapper { get; }

    //Create
    [HttpPost]
    [Route("Create")]
    public async Task<IActionResult> CreateCandidate([FromForm] CandidateCreateDto? dto, IFormFile pdfFile)
    {
        if (dto == null) return BadRequest(new { message = "Candidate object is null" });

        //File validation
        const int fiveMegabyte = 5 * 1024 * 1024;
        const string pdfMimeType = "application/pdf";

        if (pdfFile.Length > fiveMegabyte || pdfFile.ContentType != pdfMimeType)
            return BadRequest("File format or size is not valid!\nOnly PDF files are allowed!");

        var resumeUrl = Guid.NewGuid() + ".pdf";
        var directoryPath = Path.Combine(Directory.GetCurrentDirectory(), "Documents", "PDF");

        if (!Directory.Exists(directoryPath)) Directory.CreateDirectory(directoryPath);

        var filePath = Path.Combine(directoryPath, resumeUrl);

        while (System.IO.File.Exists(filePath))
        {
            resumeUrl = Guid.NewGuid() + ".pdf";
            filePath = Path.Combine(directoryPath, resumeUrl);
        }

        await pdfFile.CopyToAsync(new FileStream(filePath, FileMode.Create));

        var newCandidate = Mapper.Map<Candidate>(dto);
        newCandidate.ResumeUrl = resumeUrl;
        await Context.Candidates!.AddAsync(newCandidate);
        await Context.SaveChangesAsync();
        return Ok($"Candidate {newCandidate.FirstName} {newCandidate.LastName} created successfully");
    }

    //Read
    [HttpGet]
    [Route("Get")]
    public async Task<ActionResult<IEnumerable<CandidateGetDto>>> GetCandidates()
    {
        var candidates = await (Context.Candidates ?? throw new InvalidOperationException())
            .Include(candidate => candidate.Job)
            .ToListAsync();
        var convertedCandidates = Mapper.Map<IEnumerable<CandidateGetDto>>(candidates);
        return Ok(convertedCandidates);
    }

    //Read (Download pdf)
    [HttpGet]
    [Route("Download/{url}")]
    public IActionResult DownloadPdfFile(string url)
    {
        var sourceFilePath = Path.Combine(Directory.GetCurrentDirectory(), "Documents", "PDF", url);

        if (!System.IO.File.Exists(sourceFilePath)) return NotFound("File not found.");

        // Generate a unique temporary file name
        var tempFileName = Guid.NewGuid() + ".pdf";
        var tempFilePath = Path.Combine(Path.GetTempPath(), tempFileName);

        // Copy the source file to the temporary location
        System.IO.File.Copy(sourceFilePath, tempFilePath);

        // Read the contents of the temporary file
        byte[] pdfBytes;
        using (var fileStream = new FileStream(tempFilePath, FileMode.Open, FileAccess.Read))
        {
            pdfBytes = new byte[fileStream.Length];
            fileStream.Read(pdfBytes, 0, (int)fileStream.Length);
        }

        // Delete the temporary file after reading it
        System.IO.File.Delete(tempFilePath);

        var pdfFile = File(pdfBytes, "application/pdf", url);
        return pdfFile;
    }

    //Get by ID
    [HttpGet("{id:long}")]
    public async Task<ActionResult<CandidateGetDto>> GetCandidate(long id)
    {
        Debug.Assert(Context.Candidates != null, "Context.Candidates != null");
        var candidate = await Context.Candidates
            .Include(candidate => candidate.Job)
            .FirstOrDefaultAsync(q => q.Id == id);

        if (candidate == null) return NotFound();

        var convertedCandidate = Mapper.Map<CandidateGetDto>(candidate);
        return Ok(convertedCandidate);
    }

    //Edit
    [HttpPut("Edit/{id:long}")]
    public async Task<IActionResult> EditJob(long id, [FromBody] CandidateCreateDto dto)
    {
        if (id <= 0) throw new ArgumentOutOfRangeException(nameof(id));
        if (!ModelState.IsValid) return BadRequest(ModelState);

        Debug.Assert(Context.Candidates != null, "Context.Candidates != null");
        var existingCandidate = await Context.Candidates
            .Include(candidate => candidate.Job)
            .FirstOrDefaultAsync(q => q.Id == id);

        if (existingCandidate == null) return NotFound();

        Mapper.Map(dto, existingCandidate);
        await Context.SaveChangesAsync();

        return Ok($"Candidate {existingCandidate.FirstName} {existingCandidate.LastName} edited successfully");
    }

    //Delete
    [HttpDelete]
    [Route("Delete")]
    public async Task<IActionResult> DeleteCandidate(long id)
    {
        try
        {
            var candidate = await Context.Candidates!.FirstOrDefaultAsync(q => q.Id == id);
            if (candidate == null) return NotFound();

            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "Documents", "PDF", candidate.ResumeUrl!);
            if (System.IO.File.Exists(filePath)) System.IO.File.Delete(filePath);

            Context.Candidates!.Remove(candidate);
            await Context.SaveChangesAsync();
            return Ok($"Candidate {candidate.FirstName} {candidate.LastName} deleted successfully");
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }
}