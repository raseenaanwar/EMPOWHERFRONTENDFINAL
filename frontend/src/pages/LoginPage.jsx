import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import '../css/Reg_css.css';
import AxiosInstance from '../axiosinstance'; // Import your Axios instance
const LoginPage = ({ onLogin }) => { // Receive onLogin callback function as prop
    const navigate = useNavigate();
    const [logindata, setLogindata] = useState({
        email: "",
        password: ""
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const handleOnchange = (e) => {
        setLogindata({ ...logindata, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { email, password } = logindata;
        if (!email || !password) {
            setError("Email and Password are required");
            return;
        }

        try {
            setIsLoading(true);
            const response = await AxiosInstance.post('/login/', logindata);
            setIsLoading(false);

            if (response.status === 200) {  
                const data = response.data;
                const token = data.access_token;
                localStorage.setItem('token', token);
                localStorage.setItem('email',email)
                console.log(data.role)
                switch (data.role) {
                    case 'MENTOR':
                        toast.success('Login successful');
                        navigate(`/mentor-dashboard?email=${encodeURIComponent(email)}`);
                        break;

                    case 'MENTEE':
                        toast.success('Login successful');
                        navigate('/mentee-dashboard');
                        break;
                    case 'admin':
                        console.log("admin login")
                        toast.success('Login successful');
                        navigate('/admin-dashboard');
                        break;
                    default:
                        navigate('/');
                }

                // Call the onLogin callback passed from App to update the authentication status
                onLogin(true);
            } else {
                toast.error('Incorrect email or password');
            }
        } catch (error) {
            setIsLoading(false);
            console.error("Login Error:", error);
            toast.error("Login failed. Please check your credentials and try again.");
        }
    };

    return (
        <>
            {/* <CustomNavbar /> */}
            <br /><br/><br/><br/><br/>
            <h3 style={{ textAlign: 'right', marginRight: '500px' }}>Sign In</h3>
            {/* {isLoading && (
                <p>Loading ...</p>
            )} */}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label>Email address</label>
                    <input type="email" value={logindata.email} name="email" onChange={handleOnchange} className="form-control" />
                    {error && <p className="error-message">{error}</p>}
                </div>
                <div className="mb-3">
                    <label>Password</label>
                    <input type="password" value={logindata.password} name="password" onChange={handleOnchange} className="form-control" />
                    {error && <p className="error-message">{error}</p>}
                </div>
                <div className="d-grid">
                    <button type="submit" className="btn btn-primary">
                        Submit
                    </button>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <p style={{ margin: '0' }} className='register-link'>Don't have an account? <Link to={'/register'}>Register here</Link></p>
    <p style={{ margin: '0' }} className='forgot-password'><Link to={'/forget_password'}>Forgot Password</Link></p>
</div>
 </form>
            </> 
    );
};

export default LoginPage;
