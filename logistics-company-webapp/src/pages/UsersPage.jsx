import { useEffect } from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, toggleAdminStatus } from "../features/users/userSlice";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

export default function UsersPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users, isLoading, error } = useSelector((state) => state.users);

  const theme = useTheme();
  const headerHeight = 64; // Example header height, adjust as needed
  const padding = theme.spacing(2);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleToggleAdmin = async (userId) => {
    await dispatch(toggleAdminStatus(userId));
    dispatch(fetchUsers());
  };

  const handleBackClick = () => {
    navigate("/employee/dashboard"); // Navigate back to the dashboard
  };

  const columns = [
    { field: "id", headerName: "ID", width: 90, hide: true },
    { field: "email", headerName: "Email", width: 200 },
    {
      field: "isAdmin",
      headerName: "Is Admin?",
      width: 130,
      valueGetter: (params) => (params.row.isAdmin ? "Yes" : "No"),
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      width: 150,
      renderCell: (params) => (
        <Button
          variant="contained"
          color={params.row.isAdmin ? "secondary" : "primary"}
          onClick={() => handleToggleAdmin(params.row.id)}
        >
          {params.row.isAdmin ? "Make Client" : "Make Admin"}
        </Button>
      ),
    },
  ];

  const rows = users.map((user, index) => ({
    ...user,
    id: user._id || index,
  }));

  return (
    // Adjusted Box styles to fill the whole viewport
    <Box
      sx={{
        height:
          "calc(100vh - " +
          headerHeight +
          "px - " +
          padding +
          " - " +
          padding +
          ")",
        width: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
        }}
      >
        <Typography variant="h4" component="h1">
          Users
        </Typography>
        <Button variant="contained" onClick={handleBackClick} color="success">
          Back to Dashboard
        </Button>
      </Box>

      <DataGrid
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
