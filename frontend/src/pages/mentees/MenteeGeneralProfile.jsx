import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import React, { useState, useEffect } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import Select from "react-select";
import MenteeSidebar from "./MenteeSidebar";
import moment from "moment-timezone";
import "react-toastify/dist/ReactToastify.css";
import countryList from "react-select-country-list";
import iso6391 from "iso-639-1";
import axios from "axios";

const MenteeGeneralProfile = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const emaill = localStorage.getItem("email");

    const [formData, setFormData] = useState({
        profession: "",
        country: "",
        timezone: "",
        language: "",
        email: emaill,
        profile_image: null,
        profile_image_preview: null, // New state for previewing the existing image
    });

    const [errors, setErrors] = useState({});
    const [countryOptions, setCountryOptions] = useState([]);
    const [languageOptions, setLanguageOptions] = useState([]);
    const [isSaved, setIsSaved] = useState(false); // State to track if saved successfully

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
                email: emaill,
                profile_image_preview: profile.profile_image, // Set the preview image
            });
        }
    }, [location.state]);

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
                    "http://127.0.0.1:8000/api/mentees/create-mentee-general-user-profile/",
                    formDataToSubmit,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );
                if (res.status === 200) {
                    toast.success("Profile saved successfully!");
                    setTimeout(() => {
                        navigate("/mentee-dashboard"); // Redirect after showing the toast message
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
        <div className=" bg-secondary">
            <div className="d-flex">
                <div className="col-2 bg-white ">
                    <MenteeSidebar />
                </div>
                <div className="col">
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <div style={{ maxWidth: "800px", margin: "auto", padding: "20px" }}>
                        {isSaved ? (
                            <div className="text-center">
                                <h2>Profile Saved Successfully!</h2>
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
                                                <div style={{ marginTop: '10px' }}>
                                                   
                                                    <img
    src={
        typeof formData.profile_image_preview === 'string'
            ? `http://localhost:8000${formData.profile_image_preview}`
            : formData.profile_image_preview
    }
    alt="profile"
    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
/>

                                                </div>
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

export default MenteeGeneralProfile;
