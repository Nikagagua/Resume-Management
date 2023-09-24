import "./jobs-grid.scss"
import Box from "@mui/material/Box";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import moment from "moment";
import {IJob} from "../../types/global.typing";
import React from "react";
import {Button} from "@mui/material";

interface IJobsGridProps {
    data: IJob[],
    onDelete: (id: number) => void,
    onEdit: (id: number) => void
}
const JobsGrid = ({ data, onDelete, onEdit }: IJobsGridProps) => {
    
const columns: GridColDef[] = [
    { field: "id", headerName:"ID", width:100},
    { field: "title", headerName:"Title", width:300},
    { field: "level", headerName:"Level", width:200},
    { field: "companyName", headerName:"Company Name", width:250},
    { field: "createdAt", headerName:"Creation Time", width:200,
        renderCell: (params) => moment(params.row.createdAt).format("YYYY-MM-DD")
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
        width: 100,
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
        <Box sx={{width:"100%", height:450}} className="jobs-grid">
            <DataGrid
                columns={columns}
                rows={data}
                getRowId={(row) => row.id}
                rowHeight={50}
            />
        </Box>
    )
}

export default JobsGrid