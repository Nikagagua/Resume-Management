import React, {useEffect, useState} from "react"
import {useNavigate} from "react-router-dom";
import {ICreateCandidateDto, IJob} from "../../types/global.typing";
import "./candidates.scss"
import httpModule from "../../helpers/http.module";
import {Button, FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import TextField from "@mui/material/TextField";


const AddCandidate = () => {

    const [candidate, setCandidate] = useState<ICreateCandidateDto>(
        {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            coverLetter: "",
            jobId: ""
        });
    
    const [jobs, setJobs] = useState<IJob[]>([])
    const [pdfFile, setPdfFile] = useState<File | null>(null)
    const redirect = useNavigate()
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        httpModule.get<IJob[]>("/Job/Get")
            .then(response => {
                setJobs(response.data);
            })
            .catch((error) => {
                setError("An error occured while fetching data.")
                console.log(error)
            })
    }, []);

    const handleClickSaveBtn = () => {
        
        const MAX_FILE_SIZE = 5 * 1024 * 1024
        
        if (pdfFile && pdfFile.size > MAX_FILE_SIZE) {
            alert("File size is too big")
            return
        }
        
        if (pdfFile && pdfFile.type !== "application/pdf") {
            alert("File format is not valid")
            return
        }
        
        if (candidate.firstName === "" 
            || candidate.lastName === "" 
            || candidate.email === "" 
            || candidate.phone === "" 
            || candidate.coverLetter === "" 
            || candidate.jobId === ""
            || !pdfFile
        )
        {
            alert("All fields are required")
            return
        }
        
        const newCandidateFormData = new FormData()
        newCandidateFormData.append("firstName", candidate.firstName);
        newCandidateFormData.append("lastName", candidate.lastName);
        newCandidateFormData.append("email", candidate.email);
        newCandidateFormData.append("phone", candidate.phone);
        newCandidateFormData.append("coverLetter", candidate.coverLetter);
        newCandidateFormData.append("jobId", candidate.jobId);
        if (pdfFile) {
            newCandidateFormData.append("pdfFile", pdfFile, pdfFile.name);
        }
        

        httpModule.post("/Candidate/Create", newCandidateFormData)
            .then(response => {
                redirect("/candidates")
            })
            .catch((error) => {
                setError(error.response?.data || "An error occurred while fetching data.");
                console.log(error);
            })
    }

    const handleClickBackBtn = () => {
        redirect("/candidates")
    }

    return (
        <div className="content">
            <div className="add-candidate">
                <h2>Add New candidate</h2>
                <TextField
                    autoComplete="off"
                    label="Candidate First Name"
                    variant="outlined"
                    value={candidate.firstName}
                    onChange={e => 
                        setCandidate({...candidate, firstName: e.target.value})}
                />
                <TextField
                    autoComplete="off"
                    label="Candidate Last Name"
                    variant="outlined"
                    value={candidate.lastName}
                    onChange={e => 
                        setCandidate({...candidate, lastName: e.target.value})}
                />
                <TextField
                    autoComplete="off"
                    label="Candidate Email"
                    variant="outlined"
                    value={candidate.email}
                    onChange={e => 
                        setCandidate({...candidate, email: e.target.value})}
                />
                <TextField
                    autoComplete="off"
                    label="Candidate Phone"
                    variant="outlined"
                    value={candidate.phone}
                    onChange={e => 
                        setCandidate({...candidate, phone: e.target.value})}
                />
                <TextField
                    autoComplete="off"
                    label="Candidate Cover Letter"
                    variant="outlined"
                    value={candidate.coverLetter}
                    onChange={e =>
                        setCandidate({...candidate, coverLetter: e.target.value})}
                    multiline
                />
                
                

                <FormControl fullWidth>
                    <InputLabel>Job Title</InputLabel>
                    <Select
                        className="job-title"
                        value={candidate.jobId}
                        label="Company Name"
                        onChange={e => 
                            setCandidate({...candidate, jobId: e.target.value})}
                    >
                        {jobs.map((job) => (
                            <MenuItem value={job.id} key={job.id}>
                                {job.title}
                            </MenuItem>
                        ))}
                    </Select>
                    
                    <form encType="multipart/form-data" className="form" onSubmit={handleClickSaveBtn}>
                        <input type="file" name="pdfFile" onChange={e =>
                            setPdfFile(e.target.files ? e.target.files[0] : null)}
                        />
                    </form>

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

export default AddCandidate