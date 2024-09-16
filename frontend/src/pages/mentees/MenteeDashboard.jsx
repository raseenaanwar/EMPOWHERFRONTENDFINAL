import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import MenteeSidebar from './MenteeSidebar';
// import MentorProfile from './MentorProfile';

const MenteeDashboard= () => {
    const [selectedMenuItem, setSelectedMenuItem] = useState(null);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get('email');
    console.log(email);
    const handleMenuItemClick = (menuItem) => {
        setSelectedMenuItem(menuItem);
    };

    return (
        <div className="dashboard-container">
            <div>
           
                <MenteeSidebar onMenuItemClick={handleMenuItemClick} email={email} />

            </div>
            {/* <div>
               
                {selectedMenuItem === 'profile' && <MentorProfile email={email} />}
               
            </div> */}
        </div>
    );
};

export default MenteeDashboard;

