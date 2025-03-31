import { Box, Button, TextField } from "@mui/material";
import { ToastContainer, toast } from 'react-toastify';
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Sidebar from "../global/Sidebar";
import Topbar from "../global/Topbar";
import { ColorModeContext, useMode } from "../../theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../../../helper";
import { useNavigate } from 'react-router-dom';

const AddCandidate = () => {
    const [theme, colorMode] = useMode();
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const CreationSuccess = () => toast.success("Candidate Created Successfully!");
    const CreationFailed = () => toast.error("Invalid Details! Please Try Again.");

    // Validation Schema
    const checkoutSchema = yup.object().shape({
        fullName: yup.string().required("Candidate name is required"),
        age: yup.number().required("Age is required").positive().integer(),
        party: yup.string().required("Party name is required"),
        bio: yup.string().required("Bio is required"),
        image: yup.mixed().required("Candidate image is required"),
        symbol: yup.mixed().required("Party symbol is required"),
    });

    const initialValues = {
        fullName: "",
        age: "",
        party: "",
        bio: "",
        image: null,
        symbol: null,
    };

    const handleSubmit = async (values) => {
        setLoading(true);
        const formDataToSend = new FormData();

        for (const key in values) {
            formDataToSend.append(key, values[key]);
        }

        try {
            const response = await axios.post(`${BASE_URL}/admin/createCandidate`, formDataToSend, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data.success) {
                CreationSuccess();
                setTimeout(() => navigate('/Candidate'), 200);
            } else {
                CreationFailed();
            }
        } catch (error) {
            CreationFailed();
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <div className="appNew">
                    <Sidebar />
                    <main className="content">
                        <Topbar />
                        <ToastContainer />
                        <Box m="20px">
                            <h2>Create New Candidate</h2>

                            <Formik
                                initialValues={initialValues}
                                validationSchema={checkoutSchema}
                                onSubmit={handleSubmit}
                            >
                                {({ values, errors, touched, handleBlur, handleChange, setFieldValue, handleSubmit }) => (
                                    <form onSubmit={handleSubmit}>
                                        <Box
                                            display="grid"
                                            gap="20px"
                                            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                                            sx={{
                                                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                                            }}
                                        >
                                            {/* Candidate Name */}
                                            <TextField
                                                fullWidth
                                                variant="filled"
                                                type="text"
                                                label="Candidate Name"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.fullName}
                                                name="fullName"
                                                error={touched.fullName && !!errors.fullName}
                                                helperText={touched.fullName && errors.fullName}
                                                sx={{ gridColumn: "span 4" }}
                                            />

                                            {/* Candidate Age */}
                                            <TextField
                                                fullWidth
                                                variant="filled"
                                                type="number"
                                                label="Candidate Age"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.age}
                                                name="age"
                                                error={touched.age && !!errors.age}
                                                helperText={touched.age && errors.age}
                                                sx={{ gridColumn: "span 2" }}
                                            />

                                            {/* Party Name */}
                                            <TextField
                                                fullWidth
                                                variant="filled"
                                                type="text"
                                                label="Candidate Party"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.party}
                                                name="party"
                                                error={touched.party && !!errors.party}
                                                helperText={touched.party && errors.party}
                                                sx={{ gridColumn: "span 2" }}
                                            />

                                            {/* Candidate Bio */}
                                            <TextField
                                                fullWidth
                                                variant="filled"
                                                type="text"
                                                label="Candidate Bio"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.bio}
                                                name="bio"
                                                error={touched.bio && !!errors.bio}
                                                helperText={touched.bio && errors.bio}
                                                sx={{ gridColumn: "span 4" }}
                                            />
                                            {/* Candidate Image Upload */}
                                            
                                            <input
                                                type="file"
                                                name="image"
                                                accept="image/*"
                                                label="Candidate Photo"
                                                onChange={(event) => setFieldValue("image", event.currentTarget.files[0])}
                                                style={{ gridColumn: "span 2", padding: "10px" }}
                                            />
                                            <p style={{ fontWeight: "bold", color: "white", margin: 0 }}>*Select Candidate Image</p>
                                            {touched.image && errors.image && <div style={{ color: "red" }}>{errors.image}</div>}

                                            {/* Party Symbol Upload */}
                                            <br/>
                                            <input
                                                type="file"
                                                name="symbol"
                                                accept="image/*"
                                                onChange={(event) => setFieldValue("symbol", event.currentTarget.files[0])}
                                                style={{ gridColumn: "span 2", padding: "10px" }}
                                            />
                                            <p style={{ fontWeight: "bold", color: "white", margin: 0 }}>*Select Party Symbol Image</p>
                                            {touched.symbol && errors.symbol && <div style={{ color: "red" }}>{errors.symbol}</div>}
                                        </Box>

                                        {/* Submit Button */}
                                        <Box display="flex" justifyContent="end" mt="20px">
                                            <Button type="submit" disabled={loading} color="secondary" variant="contained">
                                                {loading ? <div className="spinner"></div> : 'Create Candidate'}
                                            </Button>
                                        </Box>
                                    </form>
                                )}
                            </Formik>
                        </Box>
                    </main>
                </div>
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
};

export default AddCandidate;
