import {useEffect, useState} from 'react'
import './companies.scss'
import HttpModule from "../../helpers/http.module";
import {ICompany} from "../../types/global.typing";
import {Button, CircularProgress} from "@mui/material";
import {Add} from "@mui/icons-material";
import {useNavigate, useLocation} from "react-router-dom"
import CompaniesGrid from "../../components/companies/companiesgrid.component";
import GlobalSweetAlert from "../../sweetalert/globalsweetalert";
import Swal from "sweetalert2";




const Companies = () => {
    const [companies, setCompanies] = useState<ICompany[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const redirect = useNavigate()
    const location = useLocation();
    const [error, setError] = useState<string | null > (null);
    
    useEffect(() => {
        setLoading(true);
        HttpModule.get<ICompany[]>("/Company/Get")
            .then(response => {
                setCompanies(response.data);
                setLoading(false);
            })
            .catch((error) => {
                setError("An error occured while fetching data.")
                console.log(error)
                setLoading(false);
            });
    },[location.key]);
    
    const handleEditCompany = (id: number) => {
        redirect(`/companies/edit/${id}`);
    }

    const handleDeleteCompany = (id: number) => {
        GlobalSweetAlert.confirmDelete(() => {
            HttpModule.delete(`/Company/Delete?id=${id}`)
                .then(() => {
                    console.log(`job with id ${id} has been deleted.`);
                    setCompanies(companies => companies.filter(company => company.id !== id));
                    Swal.fire(
                        'Deleted!',
                        'The company has been deleted.',
                        'success'
                    );
                })
                .catch((error) => {
                    console.error('Error deleting company:', error);
                    setError("An error occured while deleting data.");
                    Swal.fire(
                        'Error!',
                        'There was an error deleting the company.',
                        'error'
                    ).then(r =>
                        redirect("/companies"));
                });
        });
    }
    
    return (
        <div className="content companies" >
            <div className="heading">
                <h2>Companies</h2>
                <Button variant="outlined" onClick={() => redirect("/companies/add")}>
                    <Add />
                </Button>
            </div>
            {
                loading 
                    ? <CircularProgress size={100}/> : companies.length === 0 
                    ? <h1>No Company</h1> : <
                        CompaniesGrid 
                            data={companies} 
                            onDelete={handleDeleteCompany}
                            onEdit={handleEditCompany}
                    />
            }
        </div>
    )
}


export default Companies