import { useState, useEffect } from 'react';
import { Box, Typography, useTheme, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "../../theme";
import axios from 'axios';
import { BASE_URL } from '../../../../helper';
import Header from "../../newComponents/Header";
import Topbar from "../global/Topbar";
import Sidebar from "../global/Sidebar";

const Team = () => {
    const [theme, colorMode] = useMode();
    const [voters, setVoters] = useState([]);
    const colors = tokens(theme.palette.mode);

    // ✅ Fetch Voters and Assign Serial Numbers
    const fetchVoters = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/admin/getVoterbyID/all`, { withCredentials: true });

            if (response.data.success) {
                console.log( "responase",response.data.voters);
                const votersWithId = response.data.voters.map((voter, index) => ({
                    ...voter._doc,
                    id: index + 1, // ✅ Unique ID based on index
                    sno: index + 1 // ✅ Serial Number starts from 1
                }));
                console.log('votersWithId',votersWithId);
                setVoters(votersWithId);
            } else {
                console.error("No voters found:", response.data.message);
            }
        } catch (error) {
            console.error("❌ Error fetching voter data:", error);
        }
    };

    // ✅ Delete Voter by Voter ID
    const deleteVoter = async (voterid) => {
        try {
            await axios.delete(`${BASE_URL}/admin/deleteVoter/${voterid}`, { withCredentials: true });
            setVoters(voters.filter(voter => voter.voterid !== voterid));
        } catch (error) {
            console.error('Error deleting voter:', error);
        }
    };

    useEffect(() => {
        fetchVoters();
    }, []);

    // ✅ Define DataGrid Columns
    const columns = [
        { field: "sno", headerName: "S.NO", width: 100, type: "number" }, // ✅ Display Serial Number
        {
            field: "image",
            headerName: "PHOTO",
            renderCell: ({ row: { image } }) => (
                <Box width="60%" m="0 auto" p="5px" display="flex" justifyContent="center">
                    <img  src={`http://localhost:5000/uploads/${image}`} alt="No Image" style={{ width: "50px", height: "50px", borderRadius: "50%" }} />
                </Box>
            ),
        },
        { field: "firstName", headerName: "FIRST NAME", cellClassName: "name-column--cell" },
        { field: "lastName", headerName: "LAST NAME", cellClassName: "name-column--cell" },
        { field: "age", headerName: "AGE", type: "number", headerAlign: "left", align: "left" },
        { field: "phone", headerName: "PHONE NUMBER" },
        { field: "voterid", headerName: "VOTER ID", type: "number", headerAlign: "left", align: "left" },
        { field: "email", headerName: "EMAIL" },
        {
            headerName: "ACTION",
            flex: 1,
            renderCell: ({ row: { voterid } }) => (
                <Box>
                    <Button variant="contained" sx={{ backgroundColor: colors.redAccent[600], color: 'white', marginRight: 2 }} onClick={() => deleteVoter(voterid)}>
                        Delete
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
                            <Header title="VOTERS" subtitle="Managing the Voters" />
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
                                {/* ✅ Assign 'id' Properly */}
                                <DataGrid rows={voters} columns={columns} getRowId={(row) => row.id} />
                            </Box>
                        </Box>
                    </main>
                </div>
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
};

export default Team;
