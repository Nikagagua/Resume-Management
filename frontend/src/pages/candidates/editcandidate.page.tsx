import React, {useEffect, useState} from 'react'
import './candidates.scss'
import HttpModule from "../../helpers/http.module";
import {ICompany, ICreateCandidateDto, ICreateJobDto, IJob} from "../../types/global.typing";
import {useNavigate, useParams} from "react-router-dom"
import {Button, FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import TextField from "@mui/material/TextField";
import httpModule from "../../helpers/http.module";


const EditJob = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const [jobs, setJobs] = useState<IJob[]>([])
    const [pdfFile, setPdfFile] = useState<File | null>(null)
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [candidate, setCandidate] = useState<ICreateCandidateDto>(
        {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            coverLetter: "",
            jobId: ""
        });
    
    useEffect(() => {
        setLoading(true);
        HttpModule.get(`/Candidate/${id}`)
            .then((response) => {
                setCandidate(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching job details:', error);
                // Handle error (e.g., show an error message or redirect)
                setLoading(false);
            });
    }, [id]);

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


    const handleUpdateCandidate = () => {
        if (candidate.firstName === ""
            || candidate.lastName === ""
            || candidate.email === ""
            || candidate.phone === ""
            || candidate.coverLetter === ""
            || candidate.jobId === ""
            || !pdfFile
        ) {
            // Send a PUT request to update the job on the backend
            HttpModule.put(`/Candidate/Edit/${id}`, candidate)
                .then(() => {
                    // Handle success (e.g., show a success message)
                    navigate('/jobs');
                })
                .catch((error) => {
                    console.error('Error updating candidate:', error);
                    // Handle error (e.g., show an error message)
                    setError('Error updating candidate. Please try again.');
                });
        } else {
            // Handle validation errors (e.g., display an error message)
            setError('Please fill in all the required fields.');
        }
    };
    const handleClickBackBtn = () => {
        navigate("/candidates")
    }
    
    if (loading) {
        return <div>Loading...</div>;
    }
    

 

    return (
        <div className="content">
            <div className="edit-candidate">
                <h2>Update Candidate</h2>
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
                    <form encType="application/pdf" className="form">
                        <input type="file" name="pdfFile" onChange={e =>
                            setPdfFile(e.target.files ? e.target.files[0] : null)}
                        />
                    </form>
                </FormControl>

                <div className="btns">
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={handleUpdateCandidate}
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
    );
}

export default EditJob