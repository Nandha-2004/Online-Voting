import "./SignUtils/CSS/Sign.css";
import signupimage from "./SignUtils/images/signup-image.jpg";
import { Link, useNavigate } from 'react-router-dom';
import "./SignUtils/CSS/style.css.map";
import Nav_bar from "../Navbar/Navbar";
import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BASE_URL } from "../../helper";

const stateCityMapping = {
    "Tamil Nadu": ["Chennai", "Coimbatore"],
    "Karnataka": ["Bengaluru", "Mysore"],
    "Maharashtra": ["Mumbai", "Pune"]
};

export default function Signup() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', age: '', city: '', state: '', dob: '',
        voterid: '', phone: '', image: null, email: '', pass: '', re_pass: ''
    });

    function calculateAge(dob) {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        if (today.getMonth() < birthDate.getMonth() || (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
            age: name === 'dob' ? calculateAge(value) : prev.age
        }));
    };

    const handleFileChange = (e) => {
        setFormData(prev => ({ ...prev, image: e.target.files[0] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const submitData = new FormData();

        Object.keys(formData).forEach(key => submitData.append(key, formData[key]));
        
        console.log("Submitting FormData:");
        for (let [key, value] of submitData.entries()) {
            console.log(key, value);
        }
        
        try {
            const response = await axios.post(`${BASE_URL}/voter/createVoter`, submitData, { headers: { "Content-Type": "multipart/form-data" } });
            toast.success(response.data.message || "Voter Created Successfully! Redirecting to login page.");
            setTimeout(() => navigate('/Login'), 2000);
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Signup failed. Please try again.";
            toast.error(errorMessage);
        }
        setLoading(false);
    };

    return (
        <div className="Sign-Container">
            <Nav_bar />
            <section className="signup">
                <div className="container">
                    <div className="signup-content">
                        <div className="signup-form">
                            <h2 className="form-title">Registration</h2>
                            <form method="POST" encType="multipart/form-data" className="register-form">
                                <ToastContainer />
                                {['firstName', 'lastName', 'dob', 'voterid', 'phone', 'email', 'pass', 're_pass'].map((field) => (
                                    <div className="form-group" key={field}>
                                        <input type={field === 'dob' ? "date" : "text"} name={field} id={field} value={formData[field]} onChange={handleChange} placeholder={`Your ${field}`} required style={{ border: errors[field] ? "2px solid red" : "" }} />
                                    </div>
                                ))}
                                <div className="form-group">
                                    <select name="state" id="state" value={formData.state} onChange={handleChange} required style={{ border: errors.state ? "2px solid red" : "" }}>
                                        <option value="">Select Your State</option>
                                        {Object.keys(stateCityMapping).map((state) => (
                                            <option key={state} value={state}>{state}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <select name="city" id="city" value={formData.city} onChange={handleChange} required style={{ border: errors.city ? "2px solid red" : "" }}>
                                        <option value="">Select Your City</option>
                                        {(stateCityMapping[formData.state] || []).map((cityName) => (
                                            <option key={cityName} value={cityName}>{cityName}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <input type="file" name="image" id="image" onChange={handleFileChange} required style={{ border: errors.image ? "2px solid red" : "" }} />
                                </div>
                                <div className="form-group form-button">
                                    <button onClick={handleSubmit} disabled={loading}>{loading ? <div className="spinner"></div> : 'Register'}</button>
                                </div>
                            </form>
                        </div>
                        <div className="signup-image">
                            <figure><img src={signupimage} alt="sign up" /></figure>
                            <Link to='/Login' className="signup-image-link">I am already a member</Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
