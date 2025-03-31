import { useState, useEffect } from 'react';
import { Box, Typography, useTheme, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "../../theme";
import Header from "../../newComponents/Header";
import Topbar from "../global/Topbar";
import Sidebar from "../global/Sidebar";
import axios from 'axios';
import { BASE_URL } from '../../../../helper';

const NewCandidates = () => {
    const [theme, colorMode] = useMode();
    const [candidates, setCandidates] = useState([]);
    const colors = tokens(theme.palette.mode);

    useEffect(() => {
        axios.get(`${BASE_URL}/admin/getCandidate`)
            .then((response) => {
                setCandidates(response.data); // No `.candidate`, just response.data
            })
            .catch(err => console.error("Error fetching data: ", err));
    }, []);

    const deleteCandidate = async (id) => {
        try {
            await axios.delete(`${BASE_URL}/admin/deleteCandidate/${id}`);
            setCandidates(candidates.filter(candidate => candidate._id !== id));
        } catch (error) {
            console.error('Error deleting candidate', error);
        }
    };

    const columns = [
        {
            field: "image",
            headerName: "PHOTO",
            renderCell: ({ row }) => (
                <Box width="60px" display="flex" justifyContent="center">
                    <img
                        src={`${BASE_URL}/party/uploads/${row.image}`}
                        alt="Candidate"
                        width="50px"
                        height="50px"
                        style={{ borderRadius: '50%' }}
                    />
                </Box>
            ),
        },
        { field: "fullName", headerName: "CANDIDATE NAME", flex: 1 },
        { field: "bio", headerName: "BIO", flex: 1 },
        { field: "party", headerName: "PARTY", flex: 1 },
        { field: "age", headerName: "AGE", type: "number", headerAlign: "left", align: "left" },
        {
            field: "actions",
            headerName: "ACTIONS",
            flex: 1,
            renderCell: ({ row }) => (
                <Box>
                    <Button variant="contained" sx={{ backgroundColor: colors.redAccent[600], color: 'white' }} onClick={() => deleteCandidate(row._id)}>Delete</Button>
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
                        <Box m="20px">
                            <Header title="CANDIDATES INFORMATION" subtitle="Managing the Candidates" />
                            <Box m="20px 0" height="70vh">
                                <DataGrid rows={candidates} columns={columns} getRowId={(row) => row._id} />
                            </Box>
                        </Box>
                    </main>
                </div>
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
};

export default NewCandidates;
