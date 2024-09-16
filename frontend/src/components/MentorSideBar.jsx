import React from 'react';
import { CDBSidebar, CDBSidebarContent, CDBSidebarMenu, CDBSidebarMenuItem } from 'cdbreact';
import { NavLink } from 'react-router-dom';
import '../css/MentorSidebar.css'; // Import the CSS file for additional styling

const MentorSidebar = ({ onMenuItemClick }) => {
    const handleClick = (menuItem) => {
        console.log("menuItem:", menuItem);
        if (onMenuItemClick) {
            onMenuItemClick(menuItem);
        }
        console.log("inside sidebar handleClick", menuItem);
    };

    return (
        <div className="sidebar-container">
            <CDBSidebar className="custom-sidebar">
                <CDBSidebarContent>
                    <CDBSidebarMenu>
                        <NavLink exact to={'/general-profile-component'} activeClassName="activeClicked">
                            <CDBSidebarMenuItem 
                                icon="user" 
                                onClick={() => handleClick('general-profile-component')} 
                                className="sidebar-item">
                                Your Profile
                            </CDBSidebarMenuItem>
                        </NavLink>
                        
                        <NavLink exact to="/mentor-availability-display" activeClassName="activeClicked">
                            <CDBSidebarMenuItem 
                                icon="clock" 
                                onClick={() => handleClick('mentor-availability-display')} 
                                className="sidebar-item">
                                Availability
                            </CDBSidebarMenuItem>
                        </NavLink>
                        <NavLink exact to="/mentor-sessions" activeClassName="activeClicked">
                            <CDBSidebarMenuItem 
                                icon="list" 
                                className="sidebar-item">
                                Mentoring Sessions
                            </CDBSidebarMenuItem>
                        </NavLink>
                        <NavLink exact to="/chat" activeClassName="activeClicked">
                            <CDBSidebarMenuItem 
                                icon="comments" 
                                className="sidebar-item">
                                Chat
                            </CDBSidebarMenuItem>
                        </NavLink>
                    </CDBSidebarMenu>
                </CDBSidebarContent>
            </CDBSidebar>
        </div>
    );
};

export default MentorSidebar;

