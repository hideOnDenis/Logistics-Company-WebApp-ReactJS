import { useEffect } from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUsers,
  toggleUserAdminStatus,
} from "../features/users/userSlice.jsx";
import Button from "@mui/material/Button";

export default function UsersPage() {
  const dispatch = useDispatch();

  const { users, isLoading, error } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // Adjusting columns to include only 'email' and optionally 'id' if available
  const columns = [
    { field: "id", headerName: "ID", width: 90, hide: true }, // Hide if you don't want to display IDs
    { field: "email", headerName: "Email", width: 200 },
    {
      field: "isAdmin",
      headerName: "Is admin?",
      width: 130,
      // Convert boolean to a more readable format
      valueGetter: (params) => (params.row.isAdmin ? "Yes" : "No"),
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      width: 150,
      renderCell: (params) => {
        const handleToggleAdmin = () => {
          dispatch(toggleUserAdminStatus(params.row.id));
        };

        return (
          <Button
            variant="contained"
            color={params.row.isAdmin ? "secondary" : "primary"}
            onClick={handleToggleAdmin}
          >
            {params.row.isAdmin ? "Make client" : "Make employee"}
          </Button>
        );
      },
    },

    // You can add more fields here as your data structure evolves
  ];

  // Transforming users data to fit DataGrid requirements (ensure each row has a unique 'id' prop)
  const rows = users.map((user, index) => ({
    ...user,
    id: user.id || index, // Fallback to index if no id
  }));

  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <DataGrid
        key={users.index}
        rows={rows}
        columns={columns}
        pageSize={5}
        loading={isLoading}
        components={{ Toolbar: GridToolbar }}
        disableSelectionOnClick
      />
      {error && <p>Error: {error}</p>}
    </Box>
  );
}
