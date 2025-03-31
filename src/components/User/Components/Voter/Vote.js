import './Vote.css';
import UserNavbar from '../../../Navbar/UserNavbar';
import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import ScrollReveal from "scrollreveal";
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import { BASE_URL } from '../../../../helper';
import { Link, useNavigate } from 'react-router-dom';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
    bgcolor: 'rgb(255, 255, 255)',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        color: theme.palette.common.white,
        fontSize: 16,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

const columns = [
    { id: 'fullname', label: 'Candidate Name', minWidth: 250, align: 'left' },
    { id: 'party', label: 'Party', minWidth: 120 },
    { id: 'age', label: 'Age', minWidth: 180, align: 'center' },
    { id: 'photo', label: 'Symbol', minWidth: 100, align: 'right' },
    { id: 'action', label: '', minWidth: 200 },
];

export default function CustomizedTables() {
    const navigate = useNavigate();
    const revealRefBottom = useRef(null);
    const revealRefLeft = useRef(null);
    const revealRefTop = useRef(null);
    const revealRefRight = useRef(null);

    useEffect(() => {
        ScrollReveal().reveal(revealRefBottom.current, { duration: 1000, delay: 300, distance: '50px', origin: 'bottom', easing: 'ease', reset: true });
        ScrollReveal().reveal(revealRefRight.current, { duration: 1000, delay: 300, distance: '50px', origin: 'right', easing: 'ease', reset: true });
        ScrollReveal().reveal(revealRefLeft.current, { duration: 1000, delay: 300, distance: '50px', origin: 'left', easing: 'ease', reset: true });
        ScrollReveal().reveal(revealRefTop.current, { duration: 1000, delay: 300, distance: '50px', origin: 'top', easing: 'ease', reset: true });
    }, []);

    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [voter, setVoter] = useState({});
    const [open, setOpen] = useState(false);

    const voterid = localStorage.getItem("voterid");

    // Fetch voter details
    useEffect(() => {
        const fetchVoterData = async () => {
            try {
                if (!voterid) {
                    console.error("No voter ID found");
                    return;
                }
                const response = await axios.get(`${BASE_URL}/voter/getVoterbyID/${voterid}`, { withCredentials: true });
                if (response.data.success) {
                    setVoter(response.data.voter);
                } else {
                    console.error("Failed to fetch user data");
                }
            } catch (error) {
                console.error("Error fetching voter data:", error);
            }
        };
        fetchVoterData();
    }, [voterid]);

    // Fetch candidates
    useEffect(() => {
        axios.get(`${BASE_URL}/admin/getCandidate`)
            .then((response) => {
                console.log("Candidates Data:", response.data);
                setCandidates(response.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching candidates: ", err);
                setError(err);
                setLoading(false);
            });
    }, []);

    const handleVote = (candidateId, partyName) => {
        if (voter.voteStatus === "Voted") {
            alert("You Have Already Voted");
        } else {
            axios.post(`${BASE_URL}/voter/e_vote`, {
                voterId: voterid,
                candidateId: candidateId,
                partyName: partyName
            }, {
                withCredentials: true,
                headers: { "Content-Type": "application/json" }
            })
            .then((response) => {
                console.log(response.data.message);
                navigate("/Admin");
                setVoter({ ...voter, voteStatus: "Voted" });
                setOpen(true);
            })
            .catch(error => {
                console.error("Error submitting vote:", error.response?.data?.message || error.message);
                alert(error.response?.data?.message || "Voting failed.");
            });
        }
    };

    if (loading) return <p>Loading candidates...</p>;
    if (error) return <p>Error fetching candidates: {error.message}</p>;

    return (
        <div className='Vote-Page'>
            <UserNavbar />
            <div className='candidate'>
                <h2 ref={revealRefLeft}>2024 India General Election</h2>
                <div className='Heading1' ref={revealRefRight}>
                    <p><span>GIVE</span> Your Vote</p>
                </div>

                {voter.voteStatus === "Voted" ? (
                    <h2 style={{ textAlign: "center", color: "green", marginTop: "50px" }}>
                        You have already successfully voted!
                    </h2>
                ) : (
                    <TableContainer component={Paper} ref={revealRefBottom}>
                        <Table sx={{ minWidth: 200 }} aria-label="customized table">
                            <TableHead>
                                <TableRow className='TableRow'>
                                    {columns.map((column) => (
                                        <TableCell className='table_row_heading'
                                            key={column.id}
                                            align={column.align}
                                            style={{ minWidth: column.minWidth }}
                                        >
                                            {column.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {candidates.map((row) => (
                                    <StyledTableRow key={row._id}>
                                        <StyledTableCell style={{display:'flex',alignItems:'end'}}>
                                            {row.image ? (
                                                <img alt="Candidate" style={{ borderRadius: '8px',width:'5rem',height:'5rem',objectFit: 'fill' }} src={`http://localhost:5000/party/uploads/${row.image}`} />
                                            ) : (<p>No image</p>)}
                                            <span className='Name-Row text' style={{ fontSize: '19px', fontWeight: 'bold' }}>{row.fullName}</span>
                                        </StyledTableCell>
                                        <StyledTableCell align='left' style={{ fontSize: '19px', fontWeight: 'bold' }}>{row.party}</StyledTableCell>
                                        <StyledTableCell align="center" style={{ fontSize: '19px', fontWeight: 'bold' }}>{row.age}</StyledTableCell>
                                        <StyledTableCell align="right" className='Symbol'>
                                            {row.symbol ? (
                                                <img alt="Symbol" className='Symbol' style={{ borderRadius: '8px' }} src={`http://localhost:5000/party/uploads/${row.symbol}`}/>
                                            ) : (<p>No image</p>)}
                                        </StyledTableCell>
                                        <StyledTableCell align="right" className="voteButton">
                                            <Button variant="contained" className="voteButton" onClick={() => handleVote(row._id, row.party)}>Vote</Button>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </div>
        </div>
    );
}
