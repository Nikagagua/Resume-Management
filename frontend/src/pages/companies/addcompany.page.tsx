import React, {useState} from "react";
import {ICreateCompanyDto} from "../../types/global.typing";
import TextField from "@mui/material/TextField";
import {FormControl, InputLabel, MenuItem, Select, Button} from "@mui/material";
import {useNavigate} from "react-router-dom";
import httpModule from "../../helpers/http.module";
import "./companies.scss";

const AddCompany = () => {
    
    const [company, setCompany] = 
        useState<ICreateCompanyDto>(
            {
                name: "", 
                size: ""
            });
    const redirect = useNavigate()
    const [error, setError] = useState<string | null > (null);
    const handleClickSaveBtn = () => {
        if (company.name === "" || company.size === "")
        {
            alert("All fields are required")
            return
        }
        httpModule.post("/Company/Create", company)
            .then(response => {
                redirect("/companies")
            })
            .catch((error) => {
                setError("An error occured while fetching data.")
                console.log(error)
            })
    }
    const handleClickBackBtn = () => {
        redirect("/companies")
    }
    
    return (
        <div className="content">
            <div className="add-company">
                <h2>Add New Company</h2>
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
                        <MenuItem value="Small">Small</MenuItem>
                        <MenuItem value="Medium">Medium</MenuItem>
                        <MenuItem value="Large">Large</MenuItem>
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

export default AddCompany