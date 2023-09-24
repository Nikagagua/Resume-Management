import React, {useEffect, useState} from 'react'
import './companies.scss'
import HttpModule from "../../helpers/http.module";
import {ICompany, ICreateCompanyDto} from "../../types/global.typing";
import {useNavigate, useParams} from "react-router-dom"
import {Button, FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import TextField from "@mui/material/TextField";
import httpModule from "../../helpers/http.module";

const companySizes = ["Small", "Medium", "Large"];
const EditCompany = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [company, setCompany] = useState<ICreateCompanyDto>({
        name: "",
        size: "",
    });
    const [companies, setCompanies] = useState<ICompany[]>([])

    useEffect(() => {
        setLoading(true);
        HttpModule.get(`/Company/${id}`)
            .then((response) => {
                setCompany(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching company details:', error);
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

    const handleUpdateCompany = () => {
        if (company.name && company.size) {
            // Send a PUT request to update the company on the backend
            HttpModule.put(`/Company/Edit/${id}`, company)
                .then(() => {
                    // Handle success (e.g., show a success message)
                    navigate('/companies');
                })
                .catch((error) => {
                    console.error('Error updating company:', error);
                    // Handle error (e.g., show an error message)
                    setError('Error updating company. Please try again.');
                });
        } else {
            // Handle validation errors (e.g., display an error message)
            setError('Please fill in all the required fields.');
        }
    };
    const handleClickBackBtn = () => {
        navigate("/companies")
    }
    
    if (loading) {
        return <div>Loading...</div>;
    }
    
    return (
        <div className="content">
            <div className="edit-company">
                <h2>Update Company</h2>
                <TextField
                    autoComplete="off"
                    label="Company Name"
                    variant="outlined"
                    value={company.name}
                    onChange={e => setCompany({...company, name: e.target.value})}
                />
                <FormControl fullWidth>
                    <InputLabel>Company Size</InputLabel>
                    <Select
                        value={company.size}
                        label="Company Size"
                        onChange={e => setCompany({...company, size: e.target.value})}
                    >
                        {companySizes.map((level) => (
                            <MenuItem value={level} key={level}>
                                {level}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <div className="btns">
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={handleUpdateCompany}
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

export default EditCompany