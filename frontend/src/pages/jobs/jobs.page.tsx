import React, {useEffect, useState} from 'react'
import './jobs.scss'
import HttpModule from "../../helpers/http.module";
import {IJob} from "../../types/global.typing";
import {Button, CircularProgress} from "@mui/material";
import {Add} from "@mui/icons-material";
import {useNavigate} from "react-router-dom"
import JobsGrid from "../../components/jobs/jobsgrid.component";
import Swal from "sweetalert2";
import GlobalSweetAlert from "../../sweetalert/globalsweetalert";
import { useLocation } from "react-router-dom";


const Jobs = () => {
    const [jobs, setJobs] = useState<IJob[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const location = useLocation();
    const redirect = useNavigate()
    const [error, setError] = useState<string | null > (null);
    
    useEffect(() => {
        setLoading(true);
        HttpModule.get<IJob[]>("/Job/Get")
            .then(response => {
                setJobs(response.data);
                setLoading(false);
            })
            .catch((error) => {
                setError("An error occured while fetching data.")
                console.log(error)
                setLoading(false);
            })
    },[location.key]);
    
    const handleEditJob = (id: number) => {
        redirect(`/jobs/edit/${id}`);
    }

    const handleDeleteJob = (id: number) => {
        GlobalSweetAlert.confirmDelete(() => {
            HttpModule.delete(`/Job/Delete?id=${id}`)
                .then(() => {
                    console.log(`job with id ${id} has been deleted.`);
                    setJobs(jobs => jobs.filter(job => job.id !== id));
                    Swal.fire(
                        'Deleted!',
                        'The job has been deleted.',
                        'success'
                    );
                })
                .catch((error) => {
                    console.error('Error deleting job:', error);
                    setError("An error occured while deleting data.");
                    Swal.fire(
                        'Error!',
                        'There was an error deleting the job.',
                        'error'
                    ).then(r => 
                        redirect("/jobs"));
                });
        });
    }
    
    return (
        <div className="content jobs" >
            <div className="heading">
                <h2>Jobs</h2>
                <Button variant="outlined" onClick={() => redirect("/jobs/add")}>
                    <Add />
                </Button>
            </div>
            {
                loading
                ? <CircularProgress size={100}/> : jobs.length === 0
                ? <h1>No Job</h1> : <
                    JobsGrid 
                            data={jobs} 
                            onDelete={handleDeleteJob} 
                            onEdit={handleEditJob}
                />
            }
        </div>
    )

}

export default Jobs