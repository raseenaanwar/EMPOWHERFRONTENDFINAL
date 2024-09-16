import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MentorSidebar from '../../components/MentorSideBar';

const MentorProfile = () => {
    const navigate = useNavigate();
    const email = localStorage.getItem("email");

    const [intro_as_mentor, setIntroduction] = useState('');
    const [mentoring_topics, setMentoringTopics] = useState('');
    const [area_of_expertise, setSelectedExpertise] = useState([]);
    const [linkedin, setLinkedin] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [errors, setErrors] = useState({});

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
        const fetchProfileData = async () => {
            try {
                const response = await axios.post('http://127.0.0.1:8000/api/mentors/get-mentor-profile/', { email });
                const { intro_as_mentor, mentoring_topics, area_of_expertise, linkedin } = response.data;

                setIntroduction(intro_as_mentor || '');
                setMentoringTopics(mentoring_topics || '');
                setSelectedExpertise(Array.isArray(area_of_expertise) ? area_of_expertise : []);
                setLinkedin(linkedin || '');
            } catch (error) {
                console.error("Error fetching profile data:", error);
            }
        };

        fetchProfileData();
    }, [email]);

    const validateFields = () => {
        const newErrors = {};
        if (!intro_as_mentor || intro_as_mentor.length > 500) {
            newErrors.intro_as_mentor = "Introduction is required and should be under 500 characters.";
        }
        if (!mentoring_topics) {
            newErrors.mentoring_topics = "Mentoring topics are required.";
        }
        if (!linkedin || !/^https?:\/\/[^\s/$.?#].[^\s]*$/.test(linkedin)) {
            newErrors.linkedin = "Please enter a valid LinkedIn URL.";
        }
        if (area_of_expertise.length === 0) {
            newErrors.area_of_expertise = "Please select at least one area of expertise.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateFields()) return;

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/mentors/create-mentor-profile/', {
                email,
                intro_as_mentor,
                mentoring_topics,
                area_of_expertise,
                linkedin
            });

            if (response.status === 200) {
                setIsSubmitted(true);
                setErrors({});
            }
        } catch (error) {
            setErrors({ api: "Error updating profile. Please try again." });
            console.error("Error updating profile:", error);
        }
    };

    return (
        <div className=' bg-secondary'>
            <div className='d-flex'>
                <div className='col-2 bg-white'>
                    <MentorSidebar />
                </div>
                <div className='col'>
                    <div style={{ maxWidth: '800px', margin: 'auto', padding: '20px' }}>
                        {isSubmitted ? (
                            <div className='text-center'>
                                <h2>Profile updated successfully!</h2>
                                <p>Redirecting to the dashboard...</p>
                            </div>
                        ) : (
                            <>
                                <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
                                    <br /><br /><br /><br />
                                    <h3>Guidance for Your Mentor Page</h3>
                                    <p>
                                        We kindly request you to compose a brief description for your mentor page. This should provide an overview of your career, including your achievements, experiences, and expertise. Additionally, you can mention any specific areas you specialize in and your approach to mentoring. Be sure to make it engaging and informative to attract mentees.
                                    </p>
                                </div>

                                <h2>Your Introduction as a Mentor</h2>
                                <textarea
                                    value={intro_as_mentor}
                                    onChange={(e) => setIntroduction(e.target.value)}
                                    placeholder="Introduction"
                                    rows={5}
                                    maxLength={500}
                                    style={{ width: '100%', marginBottom: '10px' }}
                                    required
                                />
                                {errors.intro_as_mentor && <p style={{ color: 'red', margin: '0' }}>{errors.intro_as_mentor}</p>}

                                <h2>Your Mentoring Topics</h2>
                                <textarea
                                    value={mentoring_topics}
                                    onChange={(e) => setMentoringTopics(e.target.value)}
                                    placeholder="Mentoring topics"
                                    rows={5}
                                    style={{ width: '100%', marginBottom: '10px' }}
                                    required
                                />
                                {errors.mentoring_topics && <p style={{ color: 'red', margin: '0' }}>{errors.mentoring_topics}</p>}

                                <h2>LinkedIn</h2>
                                <input
                                    type="text"
                                    value={linkedin}
                                    onChange={(e) => setLinkedin(e.target.value)}
                                    placeholder="LinkedIn URL"
                                    style={{ width: '100%', marginBottom: '10px' }}
                                    required
                                />
                                {errors.linkedin && <p style={{ color: 'red', margin: '0' }}>{errors.linkedin}</p>}

                                <h2>Area of Expertise</h2>
                                <div>
                                    {expertiseOptions.map((expertise, index) => (
                                        <label key={index} style={{ marginRight: '10px' }}>
                                            <input
                                                type="checkbox"
                                                value={expertise}
                                                checked={area_of_expertise.includes(expertise)}
                                                onChange={(e) => {
                                                    const checked = e.target.checked;
                                                    setSelectedExpertise(prev => {
                                                        if (Array.isArray(prev)) {
                                                            if (checked) return [...prev, expertise];
                                                            return prev.filter(item => item !== expertise);
                                                        }
                                                        return checked ? [expertise] : [];
                                                    });
                                                }}
                                                style={{ marginRight: '5px' }}
                                            />
                                            {expertise}
                                        </label>
                                    ))}
                                </div>
                                {errors.area_of_expertise && <p style={{ color: 'red' }}>{errors.area_of_expertise}</p>}

                                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                                    <button onClick={handleSubmit} style={{ padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px' }}>
                                        Save Changes
                                    </button>
                                </div>
                                {errors.api && <p style={{ color: 'red', textAlign: 'center' }}>{errors.api}</p>}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MentorProfile;
