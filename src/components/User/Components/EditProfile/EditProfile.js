import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../../Sign/SignUtils/CSS/Sign.css";
import "../../../Sign/SignUtils/CSS/style.css.map";
import UserNavbar from "../../../Navbar/UserNavbar";
import { ToastContainer, toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';

const BASE_URL = "http://localhost:5000"; // Backend URL

const EditProfile = () => {
    const navigate = useNavigate();
    const [voter, setVoter] = useState({
        firstName: "",
        lastName: "",
        dob: "",
        voterid: "",
        phone: "",
        email: "",
        pass: "",
        re_pass: "",
        image: "" // Store image URL
    });

    const [selectedImage, setSelectedImage] = useState(null);
    const [previewImage, setPreviewImage] = useState("");

    // ✅ Fetch Voter Data
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const voterid = localStorage.getItem("voterid");
                if (!voterid) {
                    console.error("No voter ID found");
                    return;
                }

                const response = await axios.get(`${BASE_URL}/voter/getVoterbyID/${voterid}`, {
                    withCredentials: true
                });

                if (response.data.success) {
                    setVoter(response.data.voter);
                    setPreviewImage(`${BASE_URL}/uploads/${response.data.voter.image}`);
                } else {
                    console.error("Failed to fetch user data");
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, []);

    // ✅ Handle Input Change
    const handleChange = (e) => {
        setVoter({ ...voter, [e.target.name]: e.target.value });
    };

    // ✅ Handle Image Change
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setSelectedImage(file);
        setPreviewImage(URL.createObjectURL(file)); // Show preview
    };

    // ✅ Handle Form Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("firstName", voter.firstName);
        formData.append("lastName", voter.lastName);
        formData.append("dob", voter.dob);
        formData.append("phone", voter.phone);
        formData.append("email", voter.email);
        formData.append("pass", voter.pass);
        if (selectedImage) {
            formData.append("image", selectedImage);
        }

        try {
            const response = await axios.put(`${BASE_URL}/voter/updateVoter/${voter.voterid}`, formData, {
                withCredentials: true,
                headers: { "Content-Type": "multipart/form-data" }
            });

            if (response.data.success) {
                toast.success(response.data.message || "Voter Updated Successfully! Redirecting to login page.");
                setTimeout(() => navigate('/User'), 2000);
            } else {
                alert("Failed to update profile");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    return (
        <div>
            <UserNavbar />
            <section className="signup">
                <div className="container">
                    <div className="signup-content">
                        <div className="signup-form">
                            <h2 className="form-title">Edit Your Details</h2>
                            <form className="register-form" onSubmit={handleSubmit}>
                            {previewImage && <img src={previewImage} alt="Profile Preview" width="100px" />}

                                <div className="form-group">
                                    <input type="text" name="firstName" label ="firstName" value={voter.firstName} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <input type="text" name="lastName" value={voter.lastName} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <input type="date" name="dob" value={voter.dob} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <input type="number" name="phone" value={voter.phone} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <input type="email" name="email" value={voter.email} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <input type="password" name="pass"label="Password" value={voter.pass} onChange={handleChange} />*password
                                </div>
                                <div className="form-group">
                                    <input type="file" name="image" accept="image/*" onChange={handleImageChange} />
                                </div>
                                <div className="form-group form-button">
                                    <input type="submit" className="form-submit" value="Save Changes" />
                                </div>
                                
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default EditProfile;
