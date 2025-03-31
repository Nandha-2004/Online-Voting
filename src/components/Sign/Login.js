import "./SignUtils/CSS/Sign.css";
import "./SignUtils/CSS/style.css.map";
import "./SignUtils/fonts/material-icon/css/material-design-iconic-font.min.css";
import signinimage from "./SignUtils/images/signin-image.jpg";
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NavBar from "../Navbar/Navbar";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BASE_URL } from "../../helper";
import Cookies from 'js-cookie';

const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const loginSuccess = () => toast.success("Login Successful! Redirecting...", {
        className: "toast-message",
    });

    const loginFailed = (msg) => toast.error(msg, {
        className: "toast-message",
    });

    const handleLogin = async (event) => {
        event.preventDefault();
        setLoading(true);
    
        try {
            const response = await axios.post(
                `${BASE_URL}/voter/login`,
                { username, password },
                { withCredentials: true } // 💡 Ensures cookies are sent & received
            );
    
            if (response.data.success) {
                loginSuccess();
                const userType = 'user';
                localStorage.setItem("userType", 'user'); // Store userType   
                localStorage.setItem("voterid", response.data.voterid); // Store userType    
                setTimeout(() => {
                    if (userType === "user") {
                        navigate("/User");
                    } else {
                        navigate("/login");
                    }
                }, 2000);
            } else {
                loginFailed("Invalid Details or User Doesn't Exist");
            }
        } catch (error) {
            console.error("Login failed:", error.response?.data || error.message);
            loginFailed("Login failed. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <div>
            <NavBar />
            <section className="sign-in">
                <div className="container">
                    <div className="signin-content">
                        <div className="signin-image">
                            <figure><img src={signinimage} alt="sign in" /></figure>
                            <Link to="/Signup" className="signup-image-link">Create an account</Link>
                        </div>
                        <div className="signin-form">
                            <h2 className="form-title">Sign In</h2>
                            <ToastContainer />
                            <form onSubmit={handleLogin}>
                                <div className="form-group">
                                    <label htmlFor="email">
                                        <i className="zmdi zmdi-account material-icons-name"></i> 
                                    </label>
                                    <input 
                                        type="email" 
                                        name="email" 
                                        id="email" 
                                        placeholder="Enter Email" 
                                        value={username} 
                                        onChange={(e) => setUsername(e.target.value)} 
                                        required 
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="pass">
                                        <i className="zmdi zmdi-lock"></i> 
                                    </label>
                                    <input 
                                        type="password" 
                                        name="pass" 
                                        id="pass" 
                                        placeholder="Password" 
                                        value={password} 
                                        onChange={(e) => setPassword(e.target.value)} 
                                        required 
                                    />
                                </div>
                                <div className="form-group form-button">
                                    <button type="submit" disabled={loading}>
                                        {loading ? <div className="spinner"></div> : 'Login'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Login;
