// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Link } from 'react-router-dom';
// import WorldFlags from 'react-world-flags'; // Import the flag component
// import '../css/MentorList.css'; // Ensure this path is correct

// const Find_Mentor = () => {
//     const [mentors, setMentors] = useState([]);
//     const [searchQuery, setSearchQuery] = useState('');

//     useEffect(() => {
//         axios.get('http://localhost:8000/api/mentors/mentor-list/')
//             .then(response => {
//                 setMentors(response.data);
//                 console.log(response.data); // Check if URLs are correct
//             })
//             .catch(error => {
//                 console.error('Error fetching the mentors!', error);
//             });
//     }, []);

//     const handleSearchChange = (e) => {
//         setSearchQuery(e.target.value);
//     };

//     const filteredMentors = mentors.filter(mentor =>
//         mentor.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         mentor.profession.toLowerCase().includes(searchQuery.toLowerCase())
//     );

//     return (
//         <div className="mentor-list-container">
//             <h1 className="mentor-list-heading">Discover Your Ideal Mentor</h1>
//             <div className="search-box-container">
//                 <input
//                     type="text"
//                     placeholder="Search by name or profession..."
//                     value={searchQuery}
//                     onChange={handleSearchChange}
//                     className="search-box"
//                 />
//             </div>
//             <div className="mentor-list">
//                 {filteredMentors.length > 0 ? (
//                     filteredMentors.map(mentor => (
//                         // <Link to={`/mentor-detail/${mentor.id}`} key={mentor.id} className="mentor-card-link">
                         
//                         <Link to={`/mentor-detail/${mentor.id}/`} key={mentor.user} className="mentor-card-link">
//                             <div className="mentor-card">
//                                 <img src={mentor.profile_image} alt={mentor.first_name} className="mentor-image" />
//                                 <div className="mentor-info">
//                                     <h3>
//                                         <WorldFlags
//                                             code={mentor.country} // Pass the country code to the flag component
//                                             style={{ width: '24px', height: '16px', marginRight: '10px' }} // Style the flag icon
//                                         />
//                                         {mentor.first_name} {mentor.last_name}
//                                     </h3>
//                                     <p>{mentor.profession}</p>
//                                 </div>
//                             </div>
//                         </Link>
//                     ))
//                 ) : (
//                     <p className="no-results-message">No mentors found. Please try a different search query.</p>
//                 )}
//             </div>
//         </div>
//     );
// }

// export default Find_Mentor;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import WorldFlags from 'react-world-flags'; // Import the flag component
import '../css/MentorList.css'; // Ensure this path is correct

const Find_Mentor = () => {
    const [mentors, setMentors] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        axios.get('http://localhost:8000/api/mentors/mentor-list/')
            .then(response => {
                // Ensure the response data contains `is_blocked` field
                const filteredMentors = response.data.filter(mentor => !mentor.is_blocked);
                setMentors(filteredMentors);
                console.log(filteredMentors); // Check if filtering works correctly
            })
            .catch(error => {
                console.error('Error fetching the mentors!', error);
            });
    }, []);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredMentors = mentors.filter(mentor =>
        mentor.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mentor.profession.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="mentor-list-container">
            <h1 className="mentor-list-heading">Discover Your Ideal Mentor</h1>
            <div className="search-box-container">
                <input
                    type="text"
                    placeholder="Search by name or profession..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="search-box"
                />
            </div>
            <div className="mentor-list">
                {filteredMentors.length > 0 ? (
                    filteredMentors.map(mentor => (
                        <Link to={`/mentor-detail/${mentor.id}/`} key={mentor.id} className="mentor-card-link">
                            <div className="mentor-card">
                                <img src={mentor.profile_image} alt={mentor.first_name} className="mentor-image" />
                                <div className="mentor-info">
                                    <h3>
                                        <WorldFlags
                                            code={mentor.country} // Pass the country code to the flag component
                                            style={{ width: '24px', height: '16px', marginRight: '10px' }} // Style the flag icon
                                        />
                                        {mentor.first_name} {mentor.last_name}
                                    </h3>
                                    <p>{mentor.profession}</p>
                                </div>
                            </div>
                        </Link>
                    ))
                ) : (
                    <p className="no-results-message">No mentors found. Please try a different search query.</p>
                )}
            </div>
        </div>
    );
}

export default Find_Mentor;
