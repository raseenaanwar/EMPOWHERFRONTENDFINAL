import React, { useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import AxiosInstance from '../axiosinstance';

const ResetPassword = () => {
    const navigate = useNavigate();
    const { uid, token } = useParams();
    const [newPasswords, setNewPasswords] = useState({
        password: "",
        confirm_password: "",
    });
    const { password, confirm_password } = newPasswords;

    const handleChange = (e) => {
        setNewPasswords({ ...newPasswords, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!password || !confirm_password) {
            toast.error('Password and confirm password are required');
            return;
        }
        if (password !== confirm_password) {
            toast.error('Passwords do not match');
            return;
        }

        try {
            const res = await AxiosInstance.patch('/set-new-password/', {
                password,
                confirm_password,
                uidb64: uid,
                token
            });
            const response = res.data;
            if (res.status === 200) {
                navigate('/login');
                toast.success(response.message);
            }
            console.log(response);
        } catch (error) {
            console.error("Reset Password Error:", error);
            toast.error('Failed to reset password. Please try again.');
        }
    };

    return (
        <div>
            <div className='form-container'>
                <div className='wrapper' style={{ width: "100%" }}>
                    <h2>Enter your New Password</h2>
                    <form onSubmit={handleSubmit}>
                        <div className='form-group'>
                            <label htmlFor="password">New Password:</label>
                            <input
                                type="password"
                                className='email-form'
                                name="password"
                                value={password}
                                onChange={handleChange}
                            />
                        </div>
                        <div className='form-group'>
                            <label htmlFor="confirm_password">Confirm Password:</label>
                            <input
                                type="password"
                                className='email-form'
                                name="confirm_password"
                                value={confirm_password}
                                onChange={handleChange}
                            />
                        </div>
                        <button type='submit' className='vbtn'>Submit</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
