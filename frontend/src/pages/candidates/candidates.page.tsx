import React, {useEffect, useState} from 'react'
import './candidates.scss'
import HttpModule from "../../helpers/http.module";
import {ICandidate} from "../../types/global.typing";
import {Button, CircularProgress} from "@mui/material";
import {Add} from "@mui/icons-material";
import {useNavigate} from "react-router-dom"
import CandidatesGrid from "../../components/candidates/candidatesgrid.component";
import GlobalSweetAlert from "../../sweetalert/globalsweetalert";
import Swal from "sweetalert2";
import { useLocation } from "react-router-dom";

const Candidates = () => {
    const [candidates, setCandidates] = useState<ICandidate[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const redirect = useNavigate()
    const location = useLocation();
    const [error, setError] = useState<string | null > (null);
    
    useEffect(() => {
        setLoading(true);
        HttpModule.get<ICandidate[]>("/Candidate/Get")
            .then(response => {
                setCandidates(response.data);
                setLoading(false);
            })
            .catch((error) => {
                setError("An error occured while fetching data.")
                console.log(error)
                setLoading(false);
            })
    },[location.key]);

    const handleEditCandidate = (id: number) => {
        redirect(`/candidates/edit/${id}`);
    }
    
    const handleDeleteCandidate = (id: number) => {
        GlobalSweetAlert.confirmDelete( () => {
            HttpModule.delete(`/Candidate/Delete?id=${id}`)
                .then(() => {
                    console.log(`candidate with id ${id} has been deleted.`);
                    setCandidates(candidates =>
                        candidates.filter(candidate => candidate.id !== id));
                    Swal.fire(
                        'Deleted!',
                        'The candidate has been deleted.',
                        'success'
                    );
                })
                .catch((error) => {
                    console.error('Error deleting candidate:', error);
                    setError("An error occured while deleting data.");
                    Swal.fire(
                        'Error!',
                        'There was an error deleting the candidate.',
                        'error'
                    ).then(r =>
                        redirect("/candidates"));
                });
        });
    }
    
    return (
        <div className="content candidates" >
            <div className="heading">
                <h2>Candidates</h2>
                <Button variant="outlined" onClick={() => redirect("/candidates/add")}>
                    <Add />
                </Button>
            </div>
            {
                loading
                ? <CircularProgress size={100}/> : candidates.length === 0
                ? <h1>No Candidate</h1> : <
                    CandidatesGrid 
                            data={candidates} 
                            onDelete={handleDeleteCandidate}
                            onEdit={handleEditCandidate}
                />
            }
        </div>
    )
}

export default Candidates