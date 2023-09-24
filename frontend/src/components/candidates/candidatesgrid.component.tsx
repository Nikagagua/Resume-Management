import "./candidates-grid.scss"
import Box from "@mui/material/Box";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import {ICandidate} from "../../types/global.typing";
import {baseUrl} from "../../constants/url.constants";
import {PictureAsPdf} from "@mui/icons-material";
import React from "react";
import {Button} from "@mui/material";

interface ICandidatesGridProps {
    data: ICandidate[],
    onDelete: (id: number) => void,
    onEdit: (id: number) => void
}

const CandidatesGrid = ({ data, onDelete, onEdit }: ICandidatesGridProps) => {
    
const column: GridColDef[] = [
    { field: "id", headerName:"ID", width:100},
    { field: "firstName", headerName:"First Name", width:200},
    { field: "lastName", headerName:"Last Name", width:200},
    { field: "email", headerName:"Email", width:200},
    { field: "phone", headerName:"Phone", width:200},
    { field: "coverLetter", headerName:"Cover Letter", width:300},
    { field: "jobTitle", headerName:"Job Title", width:200},
    
    {   
        field: "resumeUrl", 
        headerName:"Download Resume", 
        width:150,
        renderCell: (params) => 
            <a href={`${baseUrl}/Candidate/Download/${params.row.resumeUrl}`} download>
                <PictureAsPdf />
            </a>
    },
    {
        field: "edit",
        headerName: "Edit",
        width: 100,
        renderCell: (params) => (
            <Button
                variant="contained"
                color="warning"
                onClick={(e) => {
                    e.stopPropagation();
                    onEdit(params.row.id);
                }}
            >
                Edit
            </Button>
        )
    },
    {
        field: "delete",
        headerName: "Delete",
        width: 150,
        renderCell: (params) => (
            <Button
                variant="contained"
                color="error"
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete(params.row.id);
                }}
            >
                Delete
            </Button>
        )
    }
]
    
    return (
        <Box sx={{width:"100%", height:450}} className="candidates-grid">
            <DataGrid
                columns={column}
                rows={data}
                getRowId={(row) => row.id}
                rowHeight={50}
            />
        </Box>
    )
}

export default CandidatesGrid