using System.Diagnostics;
using AutoMapper;
using backend.Core.Context;
using backend.Core.Dtos.Company;
using backend.Core.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace backend.Controllers;

[Route("api/[controller]")]
public class CompanyController : ControllerBase
{
    private ResumeManagementDbContext Context { get; }
    private IMapper Mapper { get; }
    
    public CompanyController(ResumeManagementDbContext context, IMapper mapper)
    {
        Context = context;
        Mapper = mapper;
    }
    
    //Create
    [HttpPost]
    [Route("Create")]
    public async Task<IActionResult> CreateCompany([FromBody] CompanyCreateDto dto)
    {
        var newCompany = Mapper.Map<Company>(dto);
        if (Context.Companies != null) await Context.Companies.AddAsync(newCompany);
        await Context.SaveChangesAsync();
        return Ok($"Company {newCompany.Name} created successfully");
    }
    
    //Read
    [HttpGet]
    [Route("Get")]
    public async Task<ActionResult<IEnumerable<CompanyGetDto>>> GetCompanies()
    {
        var companies = await (Context.Companies ?? throw new InvalidOperationException())
            .OrderByDescending(q => q.CreatedAt)
            .ToListAsync();
        var convertedCompanies = Mapper.Map<IEnumerable<CompanyGetDto>>(companies);
        return Ok(convertedCompanies);
    }
    
    //Get by ID
    [HttpGet("{id:long}")]
    public async Task<ActionResult<CompanyGetDto>> GetCompany(long id)
    {
        Debug.Assert(Context.Companies != null, "Context.Companies != null");
        var company = await Context.Companies
            .FirstOrDefaultAsync(q => q.Id == id);

        if (company == null)
        {
            return NotFound();
        }

        var convertedCompany = Mapper.Map<CompanyGetDto>(company);
        return Ok(convertedCompany);
    }
    
    //Edit
    [HttpPut("Edit/{id:long}")]
    public async Task<IActionResult> EditCompany(long id, [FromBody] CompanyCreateDto dto)
    {
        if (id <= 0) throw new ArgumentOutOfRangeException(nameof(id));
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        Debug.Assert(Context.Companies != null, "Context.Companies != null");
        var existingCompany = await Context.Companies
            .FirstOrDefaultAsync(q => q.Id == id);

        if (existingCompany == null)
        {
            return NotFound();
        }

        Mapper.Map(dto, existingCompany);
        await Context.SaveChangesAsync();
        
        return Ok($"Company C {existingCompany.Name} edited successfully");
    }
    
    //Delete
    [HttpDelete]
    [Route("Delete")]
    public async Task<IActionResult> DeleteCompany(long id)
    {
        var company = await Context.Companies!.FirstOrDefaultAsync(q => q.Id == id);
        if (company == null)
        {
            return NotFound();
        }
        Context.Companies!.Remove(company);
        await Context.SaveChangesAsync();
        return Ok($"Company {company.Name} deleted successfully");
    }
}