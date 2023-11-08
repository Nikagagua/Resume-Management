using System.Diagnostics;
using AutoMapper;
using backend.Core.Context;
using backend.Core.Dtos.Job;
using backend.Core.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[Route("api/[controller]")]
public class JobController : ControllerBase
{
    public JobController(ResumeManagementDbContext context, IMapper mapper)
    {
        Context = context;
        Mapper = mapper;
    }

    private ResumeManagementDbContext Context { get; }
    private IMapper Mapper { get; }

    //Create
    [HttpPost]
    [Route("Create")]
    public async Task<IActionResult> CreateJob([FromBody] JobCreateDto dto)
    {
        var newJob = Mapper.Map<Job>(dto);
        await Context.Jobs!.AddAsync(newJob);
        await Context.SaveChangesAsync();
        return Ok($"Job {newJob.Title} created successfully");
    }


    //Read
    [HttpGet]
    [Route("Get")]
    public async Task<ActionResult<IEnumerable<JobGetDto>>> GetJobs()
    {
        var jobs = await (Context.Jobs ?? throw new InvalidOperationException())
            .OrderByDescending(q => q.CreatedAt)
            .Include(job =>
                job.Company).ToListAsync();
        var convertedJobs = Mapper.Map<IEnumerable<JobGetDto>>(jobs);
        return Ok(convertedJobs);
    }

    //Get by ID
    [HttpGet("{id:long}")]
    public async Task<ActionResult<JobGetDto>> GetJob(long id)
    {
        Debug.Assert(Context.Jobs != null, "Context.Jobs != null");
        var job = await Context.Jobs
            .Include(job => job.Company)
            .FirstOrDefaultAsync(q => q.Id == id);

        if (job == null) return NotFound();

        var convertedJob = Mapper.Map<JobGetDto>(job);
        return Ok(convertedJob);
    }

    //Edit
    [HttpPut("Edit/{id:long}")]
    public async Task<IActionResult> EditJob(long id, [FromBody] JobCreateDto dto)
    {
        if (id <= 0) throw new ArgumentOutOfRangeException(nameof(id));
        if (!ModelState.IsValid) return BadRequest(ModelState);

        Debug.Assert(Context.Jobs != null, "Context.Jobs != null");
        var existingJob = await Context.Jobs
            .FirstOrDefaultAsync(q => q.Id == id);

        if (existingJob == null) return NotFound();

        Mapper.Map(dto, existingJob);
        await Context.SaveChangesAsync();

        return Ok($"Job {existingJob.Title} edited successfully");
    }

    //Delete
    [HttpDelete]
    [Route("Delete")]
    public async Task<IActionResult> DeleteJob(long id)
    {
        var job = await Context.Jobs!.FirstOrDefaultAsync(q => q.Id == id);
        if (job == null) return NotFound();
        Context.Jobs!.Remove(job);
        await Context.SaveChangesAsync();
        return Ok($"Job {job.Title} deleted successfully");
    }
}