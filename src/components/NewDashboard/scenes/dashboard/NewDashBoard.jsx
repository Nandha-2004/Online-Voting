import { Box, IconButton, Typography, useTheme, CircularProgress } from "@mui/material";
import { useState, useEffect } from 'react';
import Header from "../../newComponents/Header"
import { tokens } from "../../theme";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import GroupIcon from "@mui/icons-material/Group";
import PersonIcon from "@mui/icons-material/Person";
import HowToVoteIcon from "@mui/icons-material/HowToVote";
import VoterbyAge from "../../newComponents/VoterbyAge";
import VoterbyState from "../../newComponents/VoterbyState";
import Result from "../../newComponents/BarChart";
import StatBox from "../../newComponents/StatBox";
import "../../New.css"
import axios from 'axios';
import { BASE_URL } from '../../../../helper';

const NewDashboard = () => {
    const [candidates, setCandidates] = useState([]);
    const [upcomingElections, setUpcomingElections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState({
        voters: 0,
        candidates: 0,
        voted: 0,
    });
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    useEffect(() => {
        setLoading(true);
        
        axios.get(`${BASE_URL}/admin/getElections`)
        .then((response) => {
            console.log("Elections Data:", response.data);
            setUpcomingElections(response.data);
            setLoading(false);
        })
        .catch(err => {
            console.error("Error fetching elections: ", err);
            setError(err);
            setLoading(false);
        });
    
        axios.get(`${BASE_URL}/admin/getCandidate`)
        .then((response) => {
            console.log("Candidates Data:", response.data);
            setCandidates(response.data);
            setData(prevData => ({
                ...prevData,
                candidates: response.data.length,  // Update candidate count
            }));
            setLoading(false);
        })
        .catch(err => {
            console.error("Error fetching candidates: ", err);
            setError(err);
            setLoading(false);
        });

        axios.get(`${BASE_URL}/admin/getVoterbyID/all`)
        .then((response) => {
            console.log("Voters Data:", response.data);
    
            // Check if response.data.voters exists and is an array
            const votersList = Array.isArray(response.data.voters)
                ? response.data.voters.map(voter => voter._doc || voter)  // Handle _doc case
                : [];
    
            console.log("Extracted Voters List:", votersList);
    
            const totalVoters = votersList.length;  
            const votedVoters = votersList.filter(voter => voter.voteStatus === "Voted").length;
    
            console.log("Total Voters:", totalVoters);
            console.log("Voted Voters:", votedVoters);
    
            setData(prevData => ({
                ...prevData,
                voters: totalVoters,
                voted: votedVoters,
            }));
    
            setLoading(false);
        })
        .catch(err => {
            console.error("Error fetching voters:", err);
            setError(err);
            setLoading(false);
        });
    
    
    }, []);
    

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <div className="mainBox">
            <Box m="20px" height="84vh">
                <Box display="flex" mb="10px" justifyContent="space-between" alignItems="center" >
                    <Header title="ADMIN DASHBOARD" subtitle="Welcome Administrator" />
                </Box>

                <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gridAutoRows="140px" gap="20px">
                    <Box gridColumn="span 4" backgroundColor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center">
                        <StatBox title={data.voters} subtitle="Total Voters" icon={<GroupIcon sx={{ color: colors.greenAccent[600], fontSize: "35px" }} />} />
                    </Box>
                    <Box gridColumn="span 4" backgroundColor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center">
                        <StatBox title={data.candidates} subtitle="Total Candidates" icon={<PersonIcon sx={{ color: colors.greenAccent[600], fontSize: "35px" }} />} />
                    </Box>
                    <Box gridColumn="span 4" backgroundColor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center">
                        <StatBox title={data.voted} subtitle="Total Voters who have Voted" icon={<HowToVoteIcon sx={{ color: colors.greenAccent[600], fontSize: "35px" }} />} />
                    </Box>

                    <Box gridColumn="span 6" gridRow="span 2" backgroundColor={colors.primary[400]} overflow="auto">
                        <Typography color={colors.grey[100]} variant="h4" fontWeight="600" p="15px">
                            Party Count
                        </Typography>

                        {/* Header Row */}
                        <Box display="flex" justifyContent="space-between" alignItems="center" p="15px" borderBottom={`4px solid ${colors.primary[500]}`}>
                            <Typography color={colors.greenAccent[500]} variant="h5" fontWeight="600" width="40%">
                                Candidate Name
                            </Typography>
                            <Typography color={colors.greenAccent[500]} variant="h5" fontWeight="600" width="30%">
                                Party Name
                            </Typography>
                            <Typography color={colors.greenAccent[500]} variant="h5" fontWeight="600" width="30%" textAlign="right">
                                Vote Count
                            </Typography>
                        </Box>

                        {/* Candidate Data */}
                        {candidates.map((candidate, i) => (
                            <Box key={`${candidate.id}-${i}`} display="flex" justifyContent="space-between" alignItems="center" borderBottom={`4px solid ${colors.primary[500]}`} p="15px">
                                <Typography color={colors.grey[100]} variant="h6" width="40%">
                                    {candidate.fullName}
                                </Typography>
                                <Typography color={colors.grey[100]} variant="h6" width="30%">
                                    {candidate.party}
                                </Typography>
                                <Typography color={colors.grey[100]} variant="h6" width="30%" textAlign="right">
                                    {candidate.voting_count || 0} {/* Ensure voteCount is displayed properly */}
                                </Typography>
                            </Box>
                        ))}
                    </Box>

                    <Box gridColumn="span 6" gridRow="span 2" backgroundColor={colors.primary[400]} p="10px">
                        <Typography color={colors.grey[100]} variant="h4" fontWeight="600" p="20px">Upcoming Elections</Typography>
                        <Box height="250px" m="5px 0 0 0" overflow="auto">
                        {upcomingElections.map((election, i) => (
                            <Box 
                                key={`${election.id}-${i}`} 
                                display="flex" 
                                justifyContent="space-between" 
                                alignItems="center" 
                                borderBottom={`4px solid ${colors.primary[500]}`} 
                                p="15px"
                                sx={{
                                    backgroundColor: election.status === "started" ? "black" : "transparent"
                                }}
                            >
                                <Typography color={colors.greenAccent[500]} variant="h5" fontWeight="600">
                                    {election.name}
                                </Typography>
                                <Typography color={colors.grey[100]}>
                                    {election.date}
                                </Typography>
                            </Box>
                        ))} 
                    </Box>
                    </Box>
                </Box>
            </Box>
        </div>
    );
}

export default NewDashboard;
