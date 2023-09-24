import "./companies-grid.scss"
import Box from "@mui/material/Box";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import moment from "moment";
import {ICompany} from "../../types/global.typing";
import {Button} from "@mui/material";

interface ICompaniesGridProps {
    data: ICompany[],
    onDelete: (id: number) => void,
    onEdit: (id: number) => void
}

const CompaniesGrid = ({ data, onDelete, onEdit }: ICompaniesGridProps) => {
    
const column: GridColDef[] = [
    { field: "id", headerName:"ID", width:100},
    { field: "name", headerName:"Name", width:200},
    { field: "size", headerName:"Size", width:150},
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
        <Box sx={{width:"100%", height:450}} className="companies-grid">
            <DataGrid 
                columns={column} 
                rows={data}
                getRowId={(row) => row.id}
                rowHeight={50}
            />
        </Box>
    )
}

export default CompaniesGrid