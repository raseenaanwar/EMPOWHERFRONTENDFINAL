// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import MenteeSidebar from "./MenteeSidebar";
// import { useNavigate } from 'react-router-dom';

// const MenteeGeneralProfileComponent = () => {
//     const email = localStorage.getItem("email");
//     const navigate = useNavigate();
//     const [profile, setProfile] = useState({
//         image: "",
//         first_name: "",
//         last_name: "",
//         profession: '',
//         country: "",
//         timezone: "",
//         language: ""
//     });

//     useEffect(() => {
//         axios.post('http://localhost:8000/api/mentees/get-mentee-user-profile/', { email })
//             .then(response => {

//                 setProfile(response.data);
//                 console.log(response.data);
//             })
//             .catch(error => {
//                 console.error("There was an error fetching the user profile!", error);
//             });
//     }, [email]);
//     const profileIsComplete = profile.first_name && profile.last_name && profile.profession && profile.country && profile.timezone && profile.language;

//     const handleEdit = () => {
//         navigate('/mentee-general-profile', { state: { profile } });
//     };

//     const profilePageContainerStyle = {
//         display: 'flex',
//         padding: '20px'
//     };

//     const mentorSidebarStyle = {
//         flex: 1,
//     };

//     const profileContainerStyle = {
//         flex: 3,
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         padding: '20px',
//         backgroundColor: '#f9f9f9',
//         borderRadius: '10px',
//         boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
//     };

//     const profileImageContainerStyle = {
//         display: 'flex',
//         justifyContent: 'center',
//         marginBottom: '20px',
//         marginTop: '100px'
//     };

//     const profileImageStyle = {
//         width: '150px',
//         height: '150px',
//         borderRadius: '50%',
//         objectFit: 'cover',
//         border: '2px solid #007bff'
//     };

//     const profileDetailsStyle = {
//         textAlign: 'left',
//         marginBottom: '20px',
//         width: '100%'
//     };

//     const profileDetailRowStyle = {
//         display: 'flex',
//         justifyContent: 'space-between',
//         margin: '10px 0',
//         padding: '10px',
//         backgroundColor: '#fff',
//         borderRadius: '5px',
//         boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
//     };

//     const editButtonStyle = {
//         padding: '10px 20px',
//         backgroundColor: '#007bff',
//         color: 'white',
//         border: 'none',
//         borderRadius: '5px',
//         cursor: 'pointer',
//         transition: 'background-color 0.3s ease'
//     };

//     const createProfileMessageStyle = {
//         textAlign: 'center',
//         fontSize: '18px',
//         marginTop: '50px',
//         color: '#333'
//     };

//     return (
//         <div style={profilePageContainerStyle}>
//             <div style={mentorSidebarStyle}>
//                 <MenteeSidebar />
//             </div>
//             <div style={profileContainerStyle}>
//                 {profileIsComplete ? (
//                     <>
//                         <div style={profileImageContainerStyle}>
//                             <img src={`http://localhost:8000${profile.profile_image}`} alt="profile" style={profileImageStyle} />
//                         </div>
//                         <div style={profileDetailsStyle}>
//                             <div style={profileDetailRowStyle}>
//                                 <strong>First Name:</strong>
//                                 <span>{profile.first_name}</span>
//                             </div>
//                             <div style={profileDetailRowStyle}>
//                                 <strong>Last Name:</strong>
//                                 <span>{profile.last_name}</span>
//                             </div>
//                             <div style={profileDetailRowStyle}>
//                                 <strong>Profession:</strong>
//                                 <span>{profile.profession}</span>
//                             </div>
//                             <div style={profileDetailRowStyle}>
//                                 <strong>Country:</strong>
//                                 <span>{profile.country}</span>
//                             </div>
//                             <div style={profileDetailRowStyle}>
//                                 <strong>Timezone:</strong>
//                                 <span>{profile.timezone}</span>
//                             </div>
//                             <div style={profileDetailRowStyle}>
//                                 <strong>Language:</strong>
//                                 <span>{profile.language}</span>
//                             </div>
//                         </div>
//                         <button
//                             onClick={handleEdit}
//                             style={editButtonStyle}
//                         >
//                             Edit
//                         </button>
//                     </>
//                 ) : (
//                     <div style={{...createProfileMessageStyle, marginTop: '100px'}}>

//                         <p>Your profile is incomplete. Please <span onClick={handleEdit} style={{color: '#007bff', cursor: 'pointer'}}>create your profile</span>.</p>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default MenteeGeneralProfileComponent;
import React, { useState, useEffect } from "react";
import axios from "axios";
import MenteeSidebar from "./MenteeSidebar";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Grid,
  Avatar,
  Typography,
  Paper,
  Button,
  Divider,
} from "@mui/material";

const MenteeGeneralProfileComponent = () => {
  const email = localStorage.getItem("email");
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    image: "",
    first_name: "",
    last_name: "",
    profession: "",
    country: "",
    timezone: "",
    language: "",
    intro_as_mentee: "",
    development_goal: "",
    linkedin: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const generalResponse = await axios.post(
          "http://localhost:8000/api/mentees/get-mentee-user-profile/",
          { email }
        );
        const detailedResponse = await axios.post(
          "http://localhost:8000/api/mentees/get-mentee-profile/",
          { email }
        );

        setProfile({
          ...generalResponse.data,
          ...detailedResponse.data,
        });
      } catch (error) {
        console.error("There was an error fetching the mentee profile!", error);
      }
    };

    fetchProfile();
  }, [email]);

  const profileIsComplete =
    profile.first_name &&
    profile.last_name &&
    profile.profession &&
    profile.country &&
    profile.timezone &&
    profile.language &&
    profile.intro_as_mentee &&
    profile.development_goal &&
    profile.linkedin;

  const handleEdit = () => {
    navigate("/mentee-profile", { state: { profile } });
  };

  return (
    <div style={{ display: "flex", marginTop: "70px" }}>
      <MenteeSidebar />
      <div>
        <Typography
          variant="h4"
          align="center"
          sx={{ mt: "40px" }}
          gutterBottom
        >
          Your Mentee Profile
        </Typography>
        <Grid container spacing={3} sx={{ display: "flex", marginTop: "50px", width:'70vw' }}>
          <Grid
            item
            xs={12}
            md={3}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          ></Grid>
          <Grid item xs={12} md={9}>
            <Paper sx={{ padding: "20px", borderRadius: "10px" }}>
              <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                <Avatar
                  alt="profile"
                  src={`http://localhost:8000${profile.profile_image}`}
                  sx={{ width: 150, height: 150, border: "2px solid #007bff" }}
                />
                 {/* <img
      src={`http://localhost:8000${profile.profile_image}`}
      alt="profile"
      sx={{ width: 150, height: 150, border: '2px solid #007bff' }}
    /> */}
                
              </Box>

              {profileIsComplete ? (
                <>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="h6" sx={{ mb: 2, color: "#007bff" }}>
                        General Information
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        <strong>First Name:</strong> {profile.first_name}
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        <strong>Last Name:</strong> {profile.last_name}
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        <strong>Profession:</strong> {profile.profession}
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        <strong>Country:</strong> {profile.country}
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        <strong>Timezone:</strong> {profile.timezone}
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        <strong>Language:</strong> {profile.language}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="h6" sx={{ mb: 2, color: "#007bff" }}>
                        Mentee Information
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        <strong>Introduction:</strong> {profile.intro_as_mentee}
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        <strong>Development Goal:</strong>{" "}
                        {profile.development_goal}
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        <strong>LinkedIn:</strong>{" "}
                        <a
                          href={profile.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "#007bff" }}
                        >
                          {profile.linkedin}
                        </a>
                      </Typography>
                    </Grid>
                  </Grid>
                  <Box
                    sx={{ display: "flex", justifyContent: "center", mt: 4 }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleEdit}
                    >
                      Edit
                    </Button>
                  </Box>
                </>
              ) : (
                <Box sx={{ textAlign: "center", mt: 8 }}>
                  <Typography variant="h6" color="textSecondary">
                    Your profile is incomplete. Please{" "}
                    <span
                      onClick={handleEdit}
                      style={{ color: "#007bff", cursor: "pointer" }}
                    >
                      complete your profile
                    </span>
                    .
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default MenteeGeneralProfileComponent;
