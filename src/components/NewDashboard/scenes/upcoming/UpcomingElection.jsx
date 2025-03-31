import { useState, useEffect } from 'react';
import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "../../theme";
import Header from "../../newComponents/Header";
import Topbar from "../global/Topbar";
import Sidebar from "../global/Sidebar";
import { Button } from '@mui/material';
import axios from 'axios';

const BASE_URL = "http://localhost:5000";

const UpcomingElection = () => {
    const [theme, colorMode] = useMode();
    const colors = tokens(theme.palette.mode);
    const [elections, setElections] = useState([]);

    // Fetch Elections from Backend
    useEffect(() => {
        axios.get(`${BASE_URL}/admin/getElections`)
            .then(response => setElections(response.data))
            .catch(error => console.error("Error fetching elections:", error));
    }, []);

    // Start/Stop Election
    const handleStartStop = async (id) => {
        try {
            const response = await axios.put(`${BASE_URL}/admin/updateElection/${id}`);
            setElections(elections.map(election => 
                election._id === id ? { ...election, status: response.data.election.status } : election
            ));
        } catch (error) {
            console.error("Error updating election status:", error);
        }
    };

    const columns = [
        { field: "name", headerName: "ELECTION NAME", flex: 1, cellClassName: "name-column--cell" },
        { field: "date", headerName: "DATE", flex: 1 },
        { field: "status", headerName: "STATUS", flex: 1, cellClassName: "name-column--cell" },
        {
            headerName: "ACTION",
            flex: 1,
            renderCell: ({ row: { _id, status } }) => (
                <Box>
                    <Button 
                        variant="contained" 
                        sx={{ 
                            backgroundColor: status === 'started' ? colors.redAccent[600] : colors.greenAccent[600], 
                            color: 'white', 
                            marginRight: 2 
                        }}
                        onClick={() => handleStartStop(_id)}
                    >
                        {status === 'started' ? 'Stop' : 'Start'}
                    </Button>
                </Box>
            ),
        },
    ];

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <div className="appNew">
                    <Sidebar />
                    <main className="content">
                        <Topbar />
                        <Box m="0px 20px">
                            <Header title="UPCOMING ELECTIONS / CURRENT ELECTIONS" subtitle="Managing the Elections" />
                            <Box
                                m="20px 0 0 0"
                                height="70vh"
                                sx={{
                                    "& .MuiDataGrid-root": { border: "none" },
                                    "& .MuiDataGrid-cell": { borderBottom: "none" },
                                    "& .name-column--cell": { color: colors.greenAccent[300] },
                                    "& .MuiDataGrid-columnHeaders": { backgroundColor: colors.blueAccent[700], borderBottom: "none" },
                                    "& .MuiDataGrid-virtualScroller": { backgroundColor: colors.primary[400] },
                                    "& .MuiDataGrid-footerContainer": { borderTop: "none", backgroundColor: colors.blueAccent[700] },
                                    "& .MuiCheckbox-root": { color: `${colors.greenAccent[200]} !important` },
                                }}
                            >
                                <DataGrid rows={elections} columns={columns} getRowId={(row) => row._id} />
                            </Box>
                        </Box>
                    </main>
                </div>
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
};

export default UpcomingElection;
