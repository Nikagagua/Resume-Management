import React, {useEffect, useState} from 'react'
import './jobs.scss'
import HttpModule from "../../helpers/http.module";
import {ICompany, ICreateJobDto} from "../../types/global.typing";
import {useNavigate, useParams} from "react-router-dom"
import {Button, FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import TextField from "@mui/material/TextField";
import httpModule from "../../helpers/http.module";

const levelIsArray: string[] = ["Junior", "MidLevel", "Senior", "TeamLead", "Cto", "Architect"]

const EditJob = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [job, setJob] = useState<ICreateJobDto>({
        title: "",
        level: "",
        companyId: ""
    });
    const [companies, setCompanies] = useState<ICompany[]>([])

    useEffect(() => {
        setLoading(true);
        HttpModule.get(`/Job/${id}`)
            .then((response) => {
                setJob(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching job details:', error);
                // Handle error (e.g., show an error message or redirect)
                setLoading(false);
            });
    }, [id]);

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

    const handleUpdateJob = () => {
        if (job.title && job.level && job.companyId) {
            // Send a PUT request to update the job on the backend
            HttpModule.put(`/Job/Edit/${id}`, job)
                .then(() => {
                    // Handle success (e.g., show a success message)
                    navigate('/jobs');
                })
                .catch((error) => {
                    console.error('Error updating job:', error);
                    // Handle error (e.g., show an error message)
                    setError('Error updating job. Please try again.');
                });
        } else {
            // Handle validation errors (e.g., display an error message)
            setError('Please fill in all the required fields.');
        }
    };
    const handleClickBackBtn = () => {
        navigate("/jobs")
    }
    
    if (loading) {
        return <div>Loading...</div>;
    }
    

 

    return (
        <div className="content">
            <div className="edit-job">
                <h2>Update Job</h2>
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
                        onClick={handleUpdateJob}
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