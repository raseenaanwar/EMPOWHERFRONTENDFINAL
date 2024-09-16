// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import MenteeSidebar from "./MenteeSidebar";

// const MenteeProfile = () => {
//     const navigate = useNavigate();
//     const email = localStorage.getItem("email");

//     const [intro_as_mentee, setIntroduction] = useState('');
//     const [development_goal, setdevelopmentGoal] = useState('');
//     const [linkedin, setLinkedin] = useState('');
//     const [isSubmitted, setIsSubmitted] = useState(false);
//     const [errors, setErrors] = useState({});

//     useEffect(() => {
//         const fetchProfileData = async () => {
//             try {
//                 const response = await axios.post('http://127.0.0.1:8000/api/mentees/get-mentee-profile/', { email });
//                 const { intro_as_mentee, development_goal, linkedin } = response.data;

//                 setIntroduction(intro_as_mentee || '');
//                 setdevelopmentGoal(development_goal || '');
//                 setLinkedin(linkedin || '');
//             } catch (error) {
//                 console.error("Error fetching profile data:", error);
//             }
//         };

//         fetchProfileData();
//     }, [email]);

//     const validateFields = () => {
//         const newErrors = {};
//         if (!intro_as_mentee || intro_as_mentee.length > 500) {
//             newErrors.intro_as_mentee = "Introduction is required and should be under 500 characters.";
//         }
//         if (!development_goal) {
//             newErrors.development_goal = "Mentoring topics are required.";
//         }
//         if (!linkedin || !/^https?:\/\/[^\s/$.?#].[^\s]*$/.test(linkedin)) {
//             newErrors.linkedin = "Please enter a valid LinkedIn URL.";
//         }

//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (!validateFields()) return;

//         try {
//             const response = await axios.post('http://127.0.0.1:8000/api/mentees/create-mentee-profile/', {
//                 email,
//                 intro_as_mentee,
//                 development_goal,
//                 linkedin
//             });

//             if (response.status === 200) {
//                 setIsSubmitted(true);
//                 setErrors({});
//             }
//         } catch (error) {
//             setErrors({ api: "Error updating profile. Please try again." });
//             console.error("Error updating profile:", error);
//         }
//     };

//     return (
//         <div className=' bg-secondary '>
//             <div className='d-flex'>
//                 <div className='col-2 bg-white '>
//                     <MenteeSidebar />
//                 </div>
//                 <div className='col'>
//                     <div style={{ maxWidth: '800px', margin: 'auto', padding: '20px' }}>
//                         {isSubmitted ? (
//                             <div className='text-center'>
//                                 <h2>Profile updated successfully!</h2>
//                                 <p>Redirecting to the dashboard...</p>
//                             </div>
//                         ) : (
//                             <>
//                                 <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
//                                     <br /><br /><br /><br />
//                                     <h3>Guidance for Your Mentee Page</h3>
//                                     <p>
//                                         We kindly request you to compose a brief description for your mentee page.
//                                     </p>
//                                 </div>

//                                 <h2>Your Introduction  as a Mentee</h2>
//                                 <textarea
//                                     value={intro_as_mentee}
//                                     onChange={(e) => setIntroduction(e.target.value)}
//                                     placeholder="Introduction"
//                                     rows={5}
//                                     maxLength={500}
//                                     style={{ width: '100%', marginBottom: '10px' }}
//                                     required
//                                 />
//                                 {errors.intro_as_mentee && <p style={{ color: 'red', margin: '0' }}>{errors.intro_as_mentee}</p>}

//                                 <h2>Your Development Goal</h2>
//                                 <textarea
//                                     value={development_goal}
//                                     onChange={(e) => setdevelopmentGoal(e.target.value)}
//                                     placeholder="Your Development Goal"
//                                     rows={5}
//                                     style={{ width: '100%', marginBottom: '10px' }}
//                                     required
//                                 />
//                                 {errors.development_goal && <p style={{ color: 'red', margin: '0' }}>{errors.development_goal}</p>}

//                                 <h2>LinkedIn</h2>
//                                 <input
//                                     type="text"
//                                     value={linkedin}
//                                     onChange={(e) => setLinkedin(e.target.value)}
//                                     placeholder="LinkedIn URL"
//                                     style={{ width: '100%', marginBottom: '10px' }}
//                                     required
//                                 />
//                                 {errors.linkedin && <p style={{ color: 'red', margin: '0' }}>{errors.linkedin}</p>}

//                                 <div style={{ textAlign: 'center', marginTop: '20px' }}>
//                                     <button onClick={handleSubmit} style={{ padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px' }}>
//                                         Save Changes
//                                     </button>
//                                 </div>
//                                 {errors.api && <p style={{ color: 'red', textAlign: 'center' }}>{errors.api}</p>}
//                             </>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default MenteeProfile;
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { Form, Row, Col, Button } from "react-bootstrap";
import Select from "react-select";
import MenteeSidebar from "./MenteeSidebar";
import moment from "moment-timezone";
import "react-toastify/dist/ReactToastify.css";
import countryList from "react-select-country-list";
import iso6391 from "iso-639-1";
import axios from "axios";

const MenteeProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = localStorage.getItem("email");

  // State for Profile Data
  const [formData, setFormData] = useState({
    profession: "",
    country: "",
    timezone: "",
    language: "",
    email: email,
    profile_image: null,
    profile_image_preview: null,
    intro_as_mentee: "",
    development_goal: "",
    linkedin: "",
  });

  const [countryOptions, setCountryOptions] = useState([]);
  const [languageOptions, setLanguageOptions] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSaved, setIsSaved] = useState(false);

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
      setFormData({
        ...formData,
        profession: profile.profession,
        country: profile.country,
        timezone: profile.timezone,
        language: profile.language,
        email: email,
        profile_image_preview: profile.profile_image,
        intro_as_mentee: profile.intro_as_mentee || "",
        development_goal: profile.development_goal || "",
        linkedin: profile.linkedin || "",
      });
    }
  }, [email, location.state]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "profile_image") {
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

  const handleChangeLanguage = (selectedOption) => {
    setFormData((prevState) => ({
      ...prevState,
      language: selectedOption.value,
    }));
  };

  const handleCountryChange = (selectedOption) => {
    setFormData((prevState) => ({
      ...prevState,
      country: selectedOption.value,
    }));
  };

  const validateField = (name, value) => {
    let error = "";
    if (name === "intro_as_mentee" && (!value || value.length > 500)) {
      error = "Introduction is required and should be under 500 characters.";
    } else if (name === "development_goal" && !value) {
      error = "Mentoring topics are required.";
    } else if (
      name === "linkedin" &&
      (!value || !/^https?:\/\/[^\s/$.?#].[^\s]*$/.test(value))
    ) {
      error = "Please enter a valid LinkedIn URL.";
    }
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
          "http://127.0.0.1:8000/api/mentees/create-mentee-profile/",
          formDataToSubmit,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (res.status === 200) {
          toast.success("Profile saved successfully!");
          setIsSaved(true);
          setErrors({});
          setTimeout(() => {
            navigate("/mentee-dashboard");
          }, 2000);
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("An error occurred. Please try again later.");
      }
    } else {
      toast.error("Please correct the errors before saving.");
    }
  };

  return (
    <div className="bg-secondary">
      <div className="d-flex">
        <div className="col-2 min-h-full" style={{backgroundColor:'#f0f0f0', width:'270px'}} >
          <MenteeSidebar />
        </div>
        <div className="col ">
          <div style={{ maxWidth: "80vw", padding: "20px", marginRight: "250px", marginTop: "90px" }}>
            {isSaved ? (
              <div className="text-center">
                <h2>Profile updated successfully!</h2>
                <p>Redirecting to the dashboard...</p>
              </div>
            ) : (
              <Form onSubmit={handleSubmit}>
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group controlId="profession">
                      <Form.Label>Profession</Form.Label>
                      <Form.Control
                        type="text"
                        name="profession"
                        value={formData.profession}
                        onChange={handleChange}
                        placeholder="Enter profession"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="country">
                      <Form.Label>Country</Form.Label>
                      <Select
                        name="country"
                        value={countryOptions.find(
                          (option) => option.value === formData.country
                        )}
                        onChange={handleCountryChange}
                        options={countryOptions}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group controlId="timezone">
                      <Form.Label>Timezone</Form.Label>
                      <Form.Control
                        as="select"
                        name="timezone"
                        value={formData.timezone}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Timezone</option>
                        {moment.tz.names().map((timezone, index) => (
                          <option key={index} value={timezone}>
                            {timezone}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group controlId="language">
                      <Form.Label>Language</Form.Label>
                      <Select
                        name="language"
                        value={languageOptions.find(
                          (option) => option.value === formData.language
                        )}
                        onChange={handleChangeLanguage}
                        options={languageOptions}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="profileImage">
                      <Form.Label>Profile Image</Form.Label>
                      <Form.Control
                        type="file"
                        name="profile_image"
                        onChange={handleChange}
                      />
                      {formData.profile_image_preview && (
                        <div style={{ marginTop: "10px" }}>
                          <img
                            src={
                              typeof formData.profile_image_preview === "string"
                                ? `http://localhost:8000${formData.profile_image_preview}`
                                : formData.profile_image_preview
                            }
                            alt="profile"
                            style={{
                              width: "100px",
                              height: "100px",
                              objectFit: "cover",
                            }}
                          />
                        </div>
                      )}
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col>
                    <Form.Group controlId="intro_as_mentee">
                      <Form.Label>Your Introduction as a Mentee</Form.Label>
                      <Form.Control
                        as="textarea"
                        name="intro_as_mentee"
                        value={formData.intro_as_mentee}
                        onChange={handleChange}
                        placeholder="Introduction"
                        rows={5}
                        maxLength={500}
                        required
                      />
                      {errors.intro_as_mentee && (
                        <p style={{ color: "red" }}>{errors.intro_as_mentee}</p>
                      )}
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col>
                    <Form.Group controlId="development_goal">
                      <Form.Label>Your Development Goal</Form.Label>
                      <Form.Control
                        as="textarea"
                        name="development_goal"
                        value={formData.development_goal}
                        onChange={handleChange}
                        placeholder="Your Development Goal"
                        rows={5}
                        required
                      />
                      {errors.development_goal && (
                        <p style={{ color: "red" }}>
                          {errors.development_goal}
                        </p>
                      )}
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col>
                    <Form.Group controlId="linkedin">
                      <Form.Label>LinkedIn URL</Form.Label>
                      <Form.Control
                        type="text"
                        name="linkedin"
                        value={formData.linkedin}
                        onChange={handleChange}
                        placeholder="LinkedIn URL"
                        required
                      />
                      {errors.linkedin && (
                        <p style={{ color: "red" }}>{errors.linkedin}</p>
                      )}
                    </Form.Group>
                  </Col>
                </Row>
                <div className="text-center">
                  <Button type="submit">Save</Button>
                </div>
              </Form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenteeProfile;
