import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import MentorSidebar from '../../components/MentorSideBar';
import MentorProfile from './MentorProfile';

const MentorDashboard = () => {
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
                {/* sidebar */}
                {/* <MentorSidebar onMenuItemClick={handleMenuItemClick} /> */}
                <MentorSidebar onMenuItemClick={handleMenuItemClick} email={email} />

            </div>
            {/* <div>
               
                {selectedMenuItem === 'profile' && <MentorProfile email={email} />}
               
            </div> */}
        </div>
    );
};

export default MentorDashboard;

