import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MenteeSidebar from "./MenteeSidebar";
import { useNavigate } from 'react-router-dom';

const MenteeProfileComponent = () => {
    const email = localStorage.getItem("email");
    const navigate = useNavigate();
    const [profile, setProfile] = useState({
        intro_as_mentee: "",
        development_goal: "",
        linkedin: "",
    });

    useEffect(() => {
        axios.post(`http://localhost:8000/api/mentees/get-mentee-profile/`, { email })
            .then(response => {
                setProfile(response.data);
                console.log(response.data)
            })
            .catch(error => {
                console.error("There was an error fetching the mentee profile!", error);
            });
    }, [email]);

    const profileIsComplete = profile.intro_as_mentee && profile.development_goal && profile.linkedin;

    const handleEdit = () => {
        console.log("handleedit in mentee profile component invoked")
        navigate('/mentee-profile', { state: { profile } });
    };

    const profilePageContainerStyle = {
        display: 'flex',
        padding: '20px',
        fontFamily: 'Arial, sans-serif'
    };

    const mentorSidebarStyle = {
        flex: 1,
    };

    const profileContainerStyle = {
        flex: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        backgroundColor: '#f9f9f9',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        maxWidth: '800px',
        margin: 'auto'
    };

    const profileDetailsStyle = {
        textAlign: 'left',
        marginBottom: '20px',
        width: '100%',
    };

    const profileDetailRowStyle = {
        display: 'flex',
        flexDirection: 'column',
        margin: '10px 0',
        padding: '15px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        fontSize: '16px',
    };

    const profileDetailLabelStyle = {
        fontWeight: 'bold',
        color: '#333',
        marginBottom: '5px',
    };

    const profileDetailValueStyle = {
        color: '#555',
    };

    const editButtonStyle = {
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
        marginTop: '20px'
    };

    const headingStyle = {
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#333',
        marginBottom: '20px',
        textAlign: 'center'
    };

    const incompleteProfileMessageStyle = {
        textAlign: 'center',
        fontSize: '18px',
        marginTop: '50px',
        color: '#333'
    };

    return (
        <div style={profilePageContainerStyle}>
            <div style={mentorSidebarStyle}>
                <MenteeSidebar />
            </div>
            <div style={profileContainerStyle}>
                <h1 style={headingStyle}>Mentee Profile</h1>
                {profileIsComplete ? (
                    <>
                        <div style={profileDetailsStyle}>
                            <div style={profileDetailRowStyle}>
                                <div style={profileDetailLabelStyle}>Introduction:</div>
                                <div style={profileDetailValueStyle}>{profile.intro_as_mentee}</div>
                            </div>
                            <div style={profileDetailRowStyle}>
                                <div style={profileDetailLabelStyle}>Development Goal:</div>
                                <div style={profileDetailValueStyle}>{profile.development_goal}</div>
                            </div>
                            <div style={profileDetailRowStyle}>
                                <div style={profileDetailLabelStyle}>LinkedIn:</div>
                                <div style={profileDetailValueStyle}>
                                    <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: '#007bff' }}>
                                        {profile.linkedin}
                                    </a>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={handleEdit}
                            style={editButtonStyle}
                        >
                            Edit
                        </button>
                    </>
                ) : (
                    <div style={incompleteProfileMessageStyle}>
                        <p>Your profile is incomplete. Please <span onClick={handleEdit} style={{ color: '#007bff', cursor: 'pointer' }}>complete your profile</span>.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MenteeProfileComponent;
