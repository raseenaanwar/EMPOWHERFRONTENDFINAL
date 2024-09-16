// import { useNavigate, useLocation } from "react-router-dom";
// import { toast } from "react-toastify";
// import React, { useState, useEffect } from "react";
// import { Form, Row, Col, Button } from "react-bootstrap";
// import Select from "react-select";
// import MentorSidebar from "../../components/MentorSideBar";
// import moment from "moment-timezone";
// import "react-toastify/dist/ReactToastify.css";
// import countryList from "react-select-country-list";
// import iso6391 from "iso-639-1";
// import axios from "axios";

// const GeneralProfile = () => {
//     const navigate = useNavigate();
//     const location = useLocation();
//     const emaill = localStorage.getItem("email");

//     const [formData, setFormData] = useState({
//         profession: "",
//         country: "",
//         timezone: "",
//         language: "",
//         email: emaill,
//         profile_image: null,
//         profile_image_preview: null, // New state for previewing the existing image
//     });

//     const [errors, setErrors] = useState({});
//     const [countryOptions, setCountryOptions] = useState([]);
//     const [languageOptions, setLanguageOptions] = useState([]);
//     const [isSaved, setIsSaved] = useState(false); // State to track if saved successfully

//     useEffect(() => {
//         const fetchCountryList = async () => {
//             const countries = await countryList().getData();
//             setCountryOptions(countries);
//         };

//         const fetchLanguageOptions = async () => {
//             const languages = await iso6391.getAllNames();
//             const options = languages.map((lang) => ({ value: lang, label: lang }));
//             setLanguageOptions(options);
//         };

//         fetchCountryList();
//         fetchLanguageOptions();

//         if (location.state && location.state.profile) {
//             const { profile } = location.state;
//             setFormData({
//                 ...formData,
//                 profession: profile.profession,
//                 country: profile.country,
//                 timezone: profile.timezone,
//                 language: profile.language,
//                 email: emaill,
//                 profile_image_preview: profile.profile_image, // Set the preview image
//             });
//         }
//     }, [location.state]);

//     const handleChange = (e) => {
//         const { name, value, files } = e.target;

//         if (name === 'profile_image') {
//             setFormData({
//                 ...formData,
//                 profile_image: files[0],
//                 profile_image_preview: URL.createObjectURL(files[0]),
//             });
//         } else {
//             setFormData({
//                 ...formData,
//                 [name]: value,
//             });
//         }
//         validateField(name, value);
//     };

//     const handleChangeLanguage = (selectedOption) => {
//         setFormData((prevState) => ({
//             ...prevState,
//             language: selectedOption.value,
//         }));
//     };

//     const handleCountryChange = (selectedOption) => {
//         setFormData((prevState) => ({
//             ...prevState,
//             country: selectedOption.value,
//         }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         validateAllFields();

//         const hasErrors = Object.values(errors).some((error) => error);

//         if (!hasErrors) {
//             try {
//                 const formDataToSubmit = new FormData();

//                 // Append form data
//                 for (const key in formData) {
//                     formDataToSubmit.append(key, formData[key]);
//                 }

//                 const res = await axios.post(
//                     "http://127.0.0.1:8000/api/mentors/create-general-user-profile/",
//                     formDataToSubmit,
//                     {
//                         headers: {
//                             "Content-Type": "multipart/form-data",
//                         },
//                     }
//                 );
//                 if (res.status === 200) {
//                     toast.success("Profile saved successfully!");
//                     setTimeout(() => {
//                         navigate("/mentor-dashboard"); // Redirect after showing the toast message
//                     }, 2000); // Adjust the timeout duration as needed
//                     setErrors({});
//                 }
//             } catch (error) {
//                 console.error("Error:", error);
//                 toast.error("An error occurred. Please try again later.");
//             }
//         } else {
//             toast.error("All Fields required.");
//         }
//     };

//     const validateField = (name, value) => {
//         let error = "";
//         setErrors((prevState) => ({
//             ...prevState,
//             [name]: error,
//         }));
//     };

//     const validateAllFields = () => {
//         for (const [key, value] of Object.entries(formData)) {
//             validateField(key, value);
//         }
//     };

//     return (
//         <div className="bg-secondary ">
//             <div className="d-flex">
//                 <div className="">
//                     <MentorSidebar />
//                 </div>
//                 <div className="col">
                   
//                     <div style={{ maxWidth: "800px", padding: "20px", marginTop:"130px" }}>
//                         {isSaved ? (
//                             <div className="text-center">
//                                 <h2>Profile Saved Successfully!</h2>
//                             </div>
//                         ) : (
//                             <Form onSubmit={handleSubmit}  >
//                                 <Row className="mb-3">
//                                     <Col md={6}>
//                                         <Form.Group controlId="profession">
//                                             <Form.Label>Profession</Form.Label>
//                                             <Form.Control
//                                                 type="text"
//                                                 name="profession"
//                                                 value={formData.profession}
//                                                 onChange={handleChange}
//                                                 placeholder="Enter profession"
//                                                 required
//                                             />
//                                         </Form.Group>
//                                     </Col>
//                                     <Col md={6}>
//                                         <Form.Group controlId="country">
//                                             <Form.Label>Country</Form.Label>
//                                             <Select
//                                                 name="country"
//                                                 value={countryOptions.find(
//                                                     (option) => option.value === formData.country
//                                                 )}
//                                                 onChange={handleCountryChange}
//                                                 options={countryOptions}
//                                                 required
//                                             />
//                                         </Form.Group>
//                                     </Col>
//                                 </Row>
//                                 <Row className="mb-3">
//                                     <Col md={6}>
//                                         <Form.Group controlId="timezone">
//                                             <Form.Label>Timezone</Form.Label>
//                                             <Form.Control
//                                                 as="select"
//                                                 name="timezone"
//                                                 value={formData.timezone}
//                                                 onChange={handleChange}
//                                                 required
//                                             >
//                                                 <option value="">Select Timezone</option>
//                                                 {moment.tz.names().map((timezone, index) => (
//                                                     <option key={index} value={timezone}>
//                                                         {timezone}
//                                                     </option>
//                                                 ))}
//                                             </Form.Control>
//                                         </Form.Group>
//                                     </Col>
//                                 </Row>
//                                 <Row className="mb-3">
//                                     <Col md={6}>
//                                         <Form.Group controlId="language">
//                                             <Form.Label>Language</Form.Label>
//                                             <Select
//                                                 name="language"
//                                                 value={languageOptions.find(
//                                                     (option) => option.value === formData.language
//                                                 )}
//                                                 onChange={handleChangeLanguage}
//                                                 options={languageOptions}
//                                                 required
//                                             />
//                                         </Form.Group>
//                                     </Col>
//                                     <Col md={6}>
//                                         <Form.Group controlId="profileImage">
//                                             <Form.Label>Profile Image</Form.Label>
//                                             <Form.Control
//                                                 type="file"
//                                                 name="profile_image"
//                                                 onChange={handleChange}
//                                             />
//                                             {formData.profile_image_preview && (
//                                                 <div style={{ marginTop: '10px' }}>
                                                   
//                                                     <img
//     src={
//         typeof formData.profile_image_preview === 'string'
//             ? `http://localhost:8000${formData.profile_image_preview}`
//             : formData.profile_image_preview
//     }
//     alt="profile"
//     style={{ width: '100px', height: '100px', objectFit: 'cover' }}
// />

//                                                 </div>
//                                             )}
//                                         </Form.Group>
//                                     </Col>
//                                 </Row>
//                                 <div className="text-center">
//                                     <Button type="submit">Save</Button>
//                                 </div>
//                             </Form>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default GeneralProfile;
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { TextField, Button, MenuItem, Box, Grid, Typography, Paper, Checkbox, FormControlLabel ,Container} from '@mui/material';
import { Select } from '@mui/material';
import MentorSidebar from '../../components/MentorSideBar';
import moment from 'moment-timezone';
import 'react-toastify/dist/ReactToastify.css';
import countryList from 'react-select-country-list';
import iso6391 from 'iso-639-1';

const GeneralProfile = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const email = localStorage.getItem("email");

    const [formData, setFormData] = useState({
        profession: "",
        country: "",
        timezone: "",
        language: "",

        email: email,
        profile_image: null,
        profile_image_preview: null, // New state for previewing the existing image
        intro_as_mentor: '',
        mentoring_topics: '',
        area_of_expertise: [],
        linkedin: '',
    });

    const [errors, setErrors] = useState({});
    const [countryOptions, setCountryOptions] = useState([]);
    const [languageOptions, setLanguageOptions] = useState([]);
    const [isSaved, setIsSaved] = useState(false); // State to track if saved successfully

    const expertiseOptions = [
        "Web Development",
        "Data Science",
        "Mobile App Development",
        "UI/UX Design",
        "Digital Marketing",
        "Project Management",
        "Entrepreneurship",
    ];

    useEffect(() => {
        const fetchCountryList = async () => {
            const countries = await countryList().getData();
            setCountryOptions(countries);
        };

        const fetchLanguageOptions = async () => {
            const languages = await iso6391.getAllNames();
            const options = languages.map((lang) => ({ value: lang, label: lang }));
            setLanguageOptions(options);
        };

        fetchCountryList();
        fetchLanguageOptions();

        if (location.state && location.state.profile) {
            const { profile } = location.state;
            console.log(profile)
            setFormData({
                ...formData,
                profession: profile.profession,
                country: profile.country,
                timezone: profile.timezone,
                language: profile.language,
                email: email,
                profile_image_preview: profile.profile_image, // Set the preview image
                
            });
        }
    }, [location.state]);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const response = await axios.post('http://127.0.0.1:8000/api/mentors/get-mentor-profile/', { email });
                const { intro_as_mentor, mentoring_topics, area_of_expertise, linkedin } = response.data;

                setFormData((prevState) => ({
                    ...prevState,
                    intro_as_mentor: intro_as_mentor || '',
                    mentoring_topics: mentoring_topics || '',
                    area_of_expertise: Array.isArray(area_of_expertise) ? area_of_expertise : [],
                    linkedin: linkedin || '',
                }));
            } catch (error) {
                console.error("Error fetching profile data:", error);
            }
        };

        fetchProfileData();
    }, [email]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === 'profile_image') {
            setFormData({
                ...formData,
                profile_image: files[0],
                profile_image_preview: URL.createObjectURL(files[0]),
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
        validateField(name, value);
    };

    const handleChangeLanguage = (event) => {
        setFormData((prevState) => ({
            ...prevState,
            language: event.target.value,
        }));
    };

    const handleCountryChange = (event) => {
        setFormData((prevState) => ({
            ...prevState,
            country: event.target.value,
        }));
    };

    const handleExpertiseChange = (event) => {
        const { value, checked } = event.target;
        setFormData((prevState) => ({
            ...prevState,
            area_of_expertise: checked
                ? [...prevState.area_of_expertise, value]
                : prevState.area_of_expertise.filter((item) => item !== value),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        validateAllFields();

        const hasErrors = Object.values(errors).some((error) => error);

        if (!hasErrors) {
            try {
                const formDataToSubmit = new FormData();

                // Append form data
                for (const key in formData) {
                    formDataToSubmit.append(key, formData[key]);
                }

                const res = await axios.post(
                    "http://127.0.0.1:8000/api/mentors/create-general-user-profile/",
                    formDataToSubmit,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );

                const mentorRes = await axios.post('http://127.0.0.1:8000/api/mentors/create-mentor-profile/', {
                    email,
                    intro_as_mentor: formData.intro_as_mentor,
                    mentoring_topics: formData.mentoring_topics,
                    area_of_expertise: formData.area_of_expertise,
                    linkedin: formData.linkedin
                });

                if (res.status === 200 && mentorRes.status === 200) {
                    toast.success("Profile saved successfully!");
                    setTimeout(() => {
                        navigate("/mentor-dashboard"); // Redirect after showing the toast message
                    }, 2000); // Adjust the timeout duration as needed
                    setErrors({});
                }
            } catch (error) {
                console.error("Error:", error);
                toast.error("An error occurred. Please try again later.");
            }
        } else {
            toast.error("All Fields required.");
        }
    };

    const validateField = (name, value) => {
        let error = "";
        setErrors((prevState) => ({
            ...prevState,
            [name]: error,
        }));
    };

    const validateAllFields = () => {
        for (const [key, value] of Object.entries(formData)) {
            validateField(key, value);
        }
    };

    return (
        <div style={{marginTop:'80px'}}>
        <Box className="bg-secondary" sx={{ display: 'flex', width:'100%' }}>
            <MentorSidebar />
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    mr:40
                }}
            >
                <Box sx={{ width: '100%' }}>
                    <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
                        <Typography variant="h4" gutterBottom>General Profile</Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Profession"
                                    name="profession"
                                    value={formData.profession}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    select
                                    label="Country"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleCountryChange}
                                    fullWidth
                                    required
                                >
                                    {countryOptions.map((country) => (
                                        <MenuItem key={country.value} value={country.value}>
                                            {country.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    select
                                    label="Timezone"
                                    name="timezone"
                                    value={formData.timezone}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                >
                                    {moment.tz.names().map((timezone, index) => (
                                        <MenuItem key={index} value={timezone}>
                                            {timezone}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    select
                                    label="Language"
                                    name="language"
                                    value={formData.language}
                                    onChange={handleChangeLanguage}
                                    fullWidth
                                    required
                                >
                                    {languageOptions.map((lang) => (
                                        <MenuItem key={lang.value} value={lang.value}>
                                            {lang.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <input
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    id="raised-button-file"
                                    type="file"
                                    name="profile_image"
                                    onChange={handleChange}
                                />
                                <label htmlFor="raised-button-file">
                                    <Button variant="contained" component="span">
                                        Upload Profile Image
                                    </Button>
                                </label>
                                {formData.profile_image_preview && (
                                    <Box mt={2}>
                                        <img
                                            src={formData.profile_image_preview}
                                            alt="Profile Preview"
                                            style={{ width: '100px', height: '100px', borderRadius: '50%' }}
                                        />
                                    </Box>
                                )}
                            </Grid>
                        </Grid>
                    </Paper>
                    <Paper elevation={3} sx={{ p: 2 }}>
                        <Typography variant="h4" gutterBottom>Mentor Profile</Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    label="Introduction as Mentor"
                                    name="intro_as_mentor"
                                    value={formData.intro_as_mentor}
                                    onChange={handleChange}
                                    multiline
                                    rows={4}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Mentoring Topics"
                                    name="mentoring_topics"
                                    value={formData.mentoring_topics}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="h6">Area of Expertise</Typography>
                                <Grid container>
                                    {expertiseOptions.map((option) => (
                                        <Grid item key={option}>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={formData.area_of_expertise.includes(option)}
                                                        onChange={handleExpertiseChange}
                                                        value={option}
                                                    />
                                                }
                                                label={option}
                                            />
                                        </Grid>
                                    ))}
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="LinkedIn URL"
                                    name="linkedin"
                                    value={formData.linkedin}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                />
                            </Grid>
                        </Grid>
                    </Paper>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{ mt: 3 }}
                        fullWidth
                    >
                        Save
                    </Button>
                </Box>
            </Box>
        </Box>
        </div>
    );
};

export default GeneralProfile;
