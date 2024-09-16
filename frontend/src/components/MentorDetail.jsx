import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import WorldFlags from 'react-world-flags';
import '../css/MentorDetail.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ScheduleComponent from './ScheduleComponent';

const MentorDetail = () => {
    const { id } = useParams();
    const [mentor, setMentor] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        setIsLoggedIn(localStorage.getItem('token') ? true : false);
    }, []);

    useEffect(() => {
        axios.get(`http://localhost:8000/api/mentors/mentor-detail/${id}/`)
            .then(response => {
                setMentor(response.data);
            })
            .catch(error => {
                console.error('Error fetching the mentor details!', error);
            });
    }, [id]);

    if (!mentor) {
        return <div>Loading...</div>;
    }

    const formatDate = (dateString) => {
        const options = { day: 'numeric', month: 'long', year: '2-digit' };
        let date = new Date(dateString).toLocaleDateString('en-GB', options);
        return date.replace(/(^|\s)\S/g, letter => letter.toUpperCase());
    };

    const formatItems = (items) => {
        return items.map((item, index) => (
            <span key={index} className="item">{item}</span>
        ));
    };

    const schedule = () => {
        if (isLoggedIn) {
            navigate(`/schedule?mentor=${id}`);
        } else {
            toast.error('Please log in to schedule with this mentor.');
        }
    };

    return (
        <div className="mentor-detail-container" style={{ marginTop: '60px' }}>
            <h1 className="mentor-detail-heading" style={{ textAlign: 'center', fontWeight: 'bold' }}>
  Mentor Detail
</h1>

            <div className="mentor-detail-card">
                <div className="mentor-detail-header">
                    <img src={`http://localhost:8000${mentor.user.profile_image}`} alt={mentor.user.first_name} className="mentor-detail-image" />
                    <div className="mentor-detail-header-info">
                        <h2>
                            <WorldFlags
                                code={mentor.user.country}
                                style={{ width: '24px', height: '16px', marginRight: '10px' }}
                            />
                            {mentor.user.first_name} {mentor.user.last_name}
                        </h2>
                        <p><strong>Members Since:</strong> {formatDate(mentor.user.date_joined)}</p>
                        <p><strong>Language:</strong> {mentor.user.language}</p>
                        <p className="mentor-detail-expertise">
                            <strong>Area of Expertise:</strong> {formatItems(mentor.area_of_expertise.replace(/[\[\]]/g, '').split(','))}
                        </p>
                        <div className="mentor-detail-buttons">
                            <button 
                                className="mentor-detail-button" 
                                style={{ 
                                    backgroundColor: '#2C3E50', // Background color
                                    color: '#fff', // Text color
                                    padding: '10px 20px', // Padding
                                    border: 'none', // Remove border
                                    borderRadius: '4px', // Rounded corners
                                    fontSize: '16px', // Font size
                                    cursor: 'pointer', // Pointer cursor on hover
                                    marginRight: '10px', // Space between buttons
                                }}
                            >
                                Reviews
                            </button>
                            <button 
                                className="mentor-detail-button" 
                                style={{ 
                                    backgroundColor: '#2C3E50', // Background color
                                    color: '#fff', // Text color
                                    padding: '10px 20px', // Padding
                                    border: 'none', // Remove border
                                    borderRadius: '4px', // Rounded corners
                                    fontSize: '16px', // Font size
                                    cursor: 'pointer', // Pointer cursor on hover
                                }}
                                onClick={schedule}
                            >
                                Schedule
                            </button>
                        </div>
                    </div>
                </div>
                <div className="mentor-detail-body">
                    <p><strong>Introduction:</strong> {mentor.intro_as_mentor}</p>
                    <p className="mentor-detail-mentoring-topics">
                        <strong>My Mentoring Topics:</strong> {formatItems(mentor.mentoring_topics.replace(/[\[\]]/g, '').split(','))}
                    </p>
                    <p><strong>Find me also on:</strong> <a href={mentor.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a></p>
                </div>
            </div>
            <ToastContainer /> {/* Place ToastContainer here or in App.js/index.js */}
        </div>
    );
};

export default MentorDetail;
