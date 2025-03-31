import "./SignUtils/CSS/Sign.css";
import "./SignUtils/CSS/style.css.map";
import "./SignUtils/fonts/material-icon/css/material-design-iconic-font.min.css";
import signinimage from "./SignUtils/images/adminbanner.png";
import { useState } from "react";
import Nav_bar from "../Navbar/Navbar";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../helper";

const AdminLogin = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const loginSuccess = () => toast.success("Login Success", {
        className: "toast-message",
    });

    const loginFailed = () => toast.error("Invalid Details \n Please Try Again!", {
        className: "toast-message",
    });

    const handleLogin = async (event) => { 
        event.preventDefault();
        
        console.log("Entered Username:", username, "Entered Password:", password); // Debugging

        if (!username || !password) {
            toast.error("Username and Password cannot be empty!");
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(`${BASE_URL}/admin/adminlogin`, { username, password });

            if (response.data.success) {
                localStorage.setItem("userType", "admin");  
                localStorage.setItem("username", response.data.username); 

                setTimeout(() => navigate("/Admin"), 2000);
                loginSuccess();
            } else {
                loginFailed();
            }
        } catch (error) {
            console.error("Login failed:", error.response?.data || error.message);
            loginFailed();
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Nav_bar />
            <section className="sign-in">
                <div className="container">
                    <div className="signin-content">
                        <div className="signin-image">
                            <figure><img src={signinimage} alt="Sign in" /></figure>
                        </div>

                        <div className="signin-form">
                            <h2 className="form-title">Admin Login</h2>
                            <ToastContainer />
                            
                            <form onSubmit={handleLogin} className="register-form">
                                <div className="form-group">
                                    <label htmlFor="email">
                                        <i className="zmdi zmdi-account material-icons-name"></i>
                                    </label>
                                    <input 
                                        type="text" 
                                        name="email" 
                                        id="email" 
                                        placeholder="Enter email" 
                                        value={username} 
                                        onChange={(e) => setUsername(e.target.value)}
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
                                    />
                                </div>

                                <div className="form-group form-button">
                                    <button type="submit" disabled={loading}>
                                        {loading ? <div className="spinner"></div> : "Login"}
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

export default AdminLogin;
