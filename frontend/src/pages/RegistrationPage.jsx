import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { useState, useEffect, useMemo } from 'react';
import '../css/Reg_css.css';
import { useNavigate } from 'react-router-dom';

import { Container,  Form, Row, Col } from 'react-bootstrap';

const RegistrationPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    password2: "",
    first_name: "",
    last_name: "",  
    role: ""
  });

  
  const [errors, setErrors] = useState({});
  const handleChange = (e) => {
    console.log("inside handlechange")
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
      
    }));
    validateField(name, value);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("inside handleSubmit");
    validateAllFields(); // Validate all fields before submitting
    console.log("inside submit after validate");
    const hasErrors = Object.values(errors).some(error => error); // Check if any errors exist
    console.log(hasErrors);
    if (!hasErrors) {
      // No errors, proceed to the next page
      console.log(formData); 
      // Perform submit actions
      try {
        const res = await axios.post("http://127.0.0.1:8000/api/register/", formData); 
        if (res.status === 201) {
          navigate("/otp/verify");
          toast.success(res.data.message);
          // Reset error state
          setErrors({});
        }
      } catch (error) {
        console.error("Error:", error);
        // Display error message to the user
        toast.error("An error occurred. Please try again later.");
      }
      // navigate('/user-profile-mentor-page');
    } else {
      toast.error("All Fields required.");
    }
  };
  

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "email":
        
        if (!value) {
          error = "Email is required";
        } else if (!isValidEmail(value)) {
          error = "Invalid email address";
        }
        break;
      case "password":
        if (!value) {
          error = "Password is required";
        } else if (!isStrongPassword(value)) {
          error = "Enter a strong Password";
        }
        break;
      case "password2":
        if (value !== formData.password) {
          error = "Passwords do not match";
        }
        break;
        case "first_name":
            if (!value.trim()) {
              error = "First name is required";
            } else if (!/^[A-Za-z]+$/.test(value)) {
              error = "First name should only contain letters";
            }
            break;
          case "last_name":
            if (!value.trim()) {
              error = "Last name is required";
            } else if (!/^[A-Za-z]+$/.test(value)) {
              error = "Last name should only contain letters";
            }
            break;
              case "role":
        if (!value) {
          error = "Role is required";
        }
        break;
      
      default:
        break;
    }
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: error
    }));
  };

  const validateAllFields = () => {
    // Validate all form fields
    console.log("in validateall")
    for (const [key, value] of Object.entries(formData)) {
      validateField(key, value);
    }
  };

  const isValidEmail = (email) => {
    // Email validation regex
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const isStrongPassword = (password) => {
    // Password strength regex
    const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
    return re.test(password);
  };

  return (
    <div>
      {/* <CustomNavbar /> */}
      <div>
        <br /><br /><br />
        <Container className="mt-5 registration-form-container">
          <div className="text-center">
            <h1>Create Your Account</h1>
          </div>
          <Form onSubmit={handleSubmit}>
            <Row className="form-group">
              <Col md={6}>
                <Form.Group controlId="firstName">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control type="text" name="first_name" value={formData.first_name} onChange={handleChange} placeholder="Enter first name" required />
                  <span className="error">{errors.first_name}</span>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="lastName">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control type="text" name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Enter last name" required />
                  <span className="error">{errors.last_name}</span>
                </Form.Group>
              </Col>
            </Row>
            <Row className="form-group">
              <Col md={6}>
                <Form.Group controlId="role">
                  <Form.Label>Role</Form.Label>
                  <Form.Select name="role" value={formData.role} onChange={handleChange} required>
                    <option value="">Select Role</option>
                    <option value="MENTOR">Mentor</option>
                    <option value="MENTEE">Mentee</option>
                    <option value="WELLWISHER">Well Wisher</option>
                  </Form.Select>
                  <span className="error">{errors.role}</span>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter email" required />
                  <span className="error">{errors.email}</span>
                </Form.Group>
              </Col>
            </Row>
             <Row className="form-group">
              <Col md={6}>
                <Form.Group controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Enter password" required />
                  <span className="error">{errors.password}</span>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="confirmPassword">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control type="password" name="password2" value={formData.password2} onChange={handleChange} placeholder="Confirm password" required />
                  <span className="error">{errors.password2}</span>
                </Form.Group>
              </Col>
            </Row>
            
            <Row className="form-group justify-content-center">
              <Col md={6}>
                <input type="submit" value="Register" className="btn btn-primary" />
              </Col>
            </Row>
           
          
            <p style={{ textAlign: 'center', marginTop: '20px' }}>Already have an account? <a href="/login">Login</a></p>
          </Form>
        </Container>
      </div>
    </div>
  );
};

export default RegistrationPage;
