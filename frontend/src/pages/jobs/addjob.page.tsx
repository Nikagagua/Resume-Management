import React, {useEffect, useState} from "react"
import {useNavigate} from "react-router-dom";
import {ICompany, ICreateJobDto, IJob} from "../../types/global.typing";
import "./jobs.scss"
import httpModule from "../../helpers/http.module";
import {Button, FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import TextField from "@mui/material/TextField";

const levelIsArray: string[] = ["Junior", "MidLevel", "Senior", "TeamLead", "Cto", "Architect"]

const AddJob = () => {
    
    const [job, setJob] = useState<ICreateJobDto>(
        {
            title: "",
            level: "",
            companyId: ""
        });
    const [companies, setCompanies] = useState<ICompany[]>([])
    const redirect = useNavigate()
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        httpModule.get<ICompany[]>("/Company/Get")
            .then(response => {
                setCompanies(response.data);
            })
            .catch((error) => {
                setError("An error occured while fetching data.")
                console.log(error)
            })
    }, []);
    
    const handleClickSaveBtn = () => {
        if (job.title === "" || job.level === "" || job.companyId === "")
        {
            alert("All fields are required")
            return
        }
        httpModule.post("/Job/Create", job)
            .then(response => {
                redirect("/jobs")
            })
            .catch((error) => {
                setError("An error occured while fetching data.")
                console.log(error)
            })
    }
    
    const handleClickBackBtn = () => {
        redirect("/jobs")
    }
    
    return (
        <div className="content">
            <div className="add-job">
                <h2>Add New Job</h2>
                <TextField
                    autoComplete="off"
                    label="Job Title"
                    variant="outlined"
                    value={job.title}
                    onChange={e => setJob({...job, title: e.target.value})}
                />
                <FormControl fullWidth>
                    <InputLabel>Job Level</InputLabel>
                    <Select
                        value={job.level}
                        label="Job Level"
                        onChange={e => setJob({...job, level: e.target.value})}
                    >
                        {levelIsArray.map((level) => (
                            <MenuItem value={level} key={level}>
                                {level}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                
                <FormControl fullWidth>
                    <InputLabel>Company Name</InputLabel>
                    <Select
                        value={job.companyId}
                        label="Company Name"
                        onChange={e => setJob({...job, companyId: e.target.value})}
                    >
                        {companies.map((company) => (
                            <MenuItem value={company.id} key={company.id}>
                                {company.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                
                <div className="btns">
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={handleClickSaveBtn}
                    >
                        Save
                    </Button>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={handleClickBackBtn}
                    >
                        back
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default AddJob