import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MentorSidebar from './MentorSideBar';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Grid, Avatar, Typography, Paper, Button, Divider } from '@mui/material';

const GeneralProfileComponent = () => {
    const email = localStorage.getItem("email");
    const navigate = useNavigate();
    const [area, setArea] = useState('')
    const [profile, setProfile] = useState({
        image: "",
        first_name: "",
        last_name: "",
        profession: '',
        country: "",
        timezone: "",
        language: "",
        intro_as_mentor: "",
        mentoring_topics: "",
        linkedin: "",
        area_of_expertise: ""
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const generalResponse = await axios.post('http://localhost:8000/api/mentors/get_user_profile/', { email });
                const mentorResponse = await axios.post('http://localhost:8000/api/mentors/get-mentor-profile/', { email });


                setProfile({
                    ...generalResponse.data,
                    ...mentorResponse.data
                });
                
            } catch (error) {
                console.error("There was an error fetching the user profile!", error);
            }
        };

        fetchProfile();
    }, [email]);

    const profileIsComplete = profile.first_name && profile.last_name && profile.profession && profile.country &&
                              profile.timezone && profile.language && profile.intro_as_mentor && profile.mentoring_topics &&
                              profile.linkedin && profile.area_of_expertise;

    const handleEdit = () => {
        navigate('/general-profile', { state: { profile } });
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 15}}>
            <Typography variant="h4" align="center" gutterBottom>
                Your Mentor Profile
            </Typography>
            <Grid container spacing={3} sx={{ display: 'flex' }}>
                <Grid item xs={12} md={3} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <MentorSidebar />
                </Grid>
                <Grid item xs={12} md={9}>
                    <Paper sx={{ padding: '20px', borderRadius: '10px' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                            <Avatar
                                alt="profile"
                                src={`http://localhost:8000${profile.profile_image}`}
                                sx={{ width: 150, height: 150, border: '2px solid #007bff' }}
                            />
                        </Box>
                        
                        {profileIsComplete ? (
                            <>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="h6" sx={{ mb: 2, color: '#007bff' }}>General Information</Typography>
                                        <Divider sx={{ mb: 2 }} />
                                        <Typography variant="body1" sx={{ mb: 1 }}><strong>First Name:</strong> {profile.first_name}</Typography>
                                        <Typography variant="body1" sx={{ mb: 1 }}><strong>Last Name:</strong> {profile.last_name}</Typography>
                                        <Typography variant="body1" sx={{ mb: 1 }}><strong>Profession:</strong> {profile.profession}</Typography>
                                        <Typography variant="body1" sx={{ mb: 1 }}><strong>Country:</strong> {profile.country}</Typography>
                                        <Typography variant="body1" sx={{ mb: 1 }}><strong>Timezone:</strong> {profile.timezone}</Typography>
                                        <Typography variant="body1" sx={{ mb: 1 }}><strong>Language:</strong> {profile.language}</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="h6" sx={{ mb: 2, color: '#007bff' }}>Mentor Information</Typography>
                                        <Divider sx={{ mb: 2 }} />
                                        <Typography variant="body1" sx={{ mb: 1 }}><strong>Intro:</strong> {profile.intro_as_mentor}</Typography>
                                        <Typography variant="body1" sx={{ mb: 1 }}><strong>Mentoring Topics:</strong> {profile.mentoring_topics}</Typography>
                                        <Typography variant="body1" sx={{ mb: 1 }}><strong>LinkedIn:</strong> <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: '#007bff' }}>{profile.linkedin}</a></Typography>
                                        <Typography variant="body1" sx={{ mb: 1 }}><strong>Area of Expertise:</strong> {profile.area_of_expertise}</Typography>
                                    </Grid>
                                </Grid>
                                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                                    <Button variant="contained" color="primary" onClick={handleEdit}>Edit</Button>
                                </Box>
                            </>
                        ) : (
                            <Box sx={{ textAlign: 'center', mt: 8 }}>
                                <Typography variant="h6" color="textSecondary">Your profile is incomplete. Please <span onClick={handleEdit} style={{color: '#007bff', cursor: 'pointer'}}>complete your profile</span>.</Typography>
                            </Box>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default GeneralProfileComponent;
