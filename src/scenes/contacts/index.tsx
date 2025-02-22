import { Box, Button } from "@mui/material";
import { DataGrid, GridToolbar, GridColDef } from "@mui/x-data-grid";
import { tokens } from "../../theme";
//import { mockDataContacts } from "../../data/mockData";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import React from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../amplify/data/resource";
import { useState, useEffect } from "react";

const client = generateClient<Schema>();

// Define the Contacts component
const Contacts: React.FC = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [users, setUsers] = useState<Array<Schema["User"]["type"]>>([]);
  const [selectedRows, setSelectedRows] = useState<Array<string | number>>([]);

  // Fetch records from the database
  useEffect(() => {
    const subscription = client.models.User.observeQuery().subscribe({
      next: (data) => setUsers([...data.items]),
    });
  
    return () => subscription.unsubscribe(); // Cleanup
  }, []);

  //function deleteUser(id: string) 
  const handleDelete = async () => {
    // ask for confirmation before deleting
    const confirmDelete = window.confirm("Are you sure you want to delete the selected items?");
    if (!confirmDelete) {
      return;
    }

    // delete the selected rows
    try {
      await Promise.all(
        selectedRows.map((id) => client.models.User.delete({ id: id.toString() }))
      );
      setUsers(users.filter((user) => !selectedRows.includes(user.id)));
      setSelectedRows([]);
    } catch (error) {
      console.error("Failed to delete selected rows:", error);
    }
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "Registrar ID" },
    {
      field: "firstName",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "age",
      headerName: "Age",
      type: "number",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "contact",
      headerName: "Phone Number",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "address",
      headerName: "Address",
      flex: 1,
    },
    {
      field: "city",
      headerName: "City",
      flex: 1,
    },
    {
      field: "zipCode",
      headerName: "Zip Code",
      flex: 1,
    },
  ];

  return (
    <Box m="20px">
      <Header
        title="CONTACTS"
        subtitle="List of Contacts for Future Reference"
      />
      <Box display="flex" justifyContent="flex-end" mb={1} mr={2}>
        <Button
          variant="contained"
          color="error"
          onClick={handleDelete}
          disabled={selectedRows.length === 0}
        >
        Delete 
      </Button></Box>
      <Box
        m="10px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={users}
          columns={columns}
          slots={{ toolbar: GridToolbar }}
          checkboxSelection
          onRowSelectionModelChange={(newSelection) => {
            setSelectedRows([...newSelection]);
            //newSelection.forEach((id) => deleteUser(id as string));
          }}
        />
      </Box>
    </Box>
  );
};

export default Contacts;