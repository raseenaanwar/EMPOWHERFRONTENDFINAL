import React from 'react';
import { CDBSidebar, CDBSidebarContent, CDBSidebarMenu, CDBSidebarMenuItem } from 'cdbreact';
import { NavLink } from 'react-router-dom';

const MenteeSidebar = ({ onMenuItemClick  }) => {
    const handleClick = (menuItem) => {
        console.log("menuItem:", menuItem);
        if (onMenuItemClick) {
            onMenuItemClick(menuItem);
        }
         };

    return (
        <>
            <br /><br /><br />
            <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
                {/* Sidebar content */}
                <CDBSidebar textColor="#333" backgroundColor='#f0f0f0'>
                    <CDBSidebarContent>
                        <CDBSidebarMenu>
                            <NavLink exact to={'/mentee-general-profile-component'} activeClassName="activeClicked">
                                <CDBSidebarMenuItem icon="user" onClick={() => handleClick('mentee-general-profile-component')}>Your Profile</CDBSidebarMenuItem>
                            </NavLink>
                            {/* <NavLink exact to="/mentee-profile-component" activeClassName="activeClicked">
                                <CDBSidebarMenuItem icon="user-tie" onClick={() => handleClick('mentee-profile-component')}>Mentee Profile</CDBSidebarMenuItem>
                            </NavLink> */}
                           <NavLink exact to="/mentor-sessions" activeClassName="activeClicked">
                                <CDBSidebarMenuItem icon="list">Mentoring Sessions</CDBSidebarMenuItem>
                            </NavLink>
                            <NavLink exact to="/chat" activeClassName="activeClicked">
                                <CDBSidebarMenuItem icon="comments">Chat</CDBSidebarMenuItem>
                            </NavLink>
                        </CDBSidebarMenu>
                    </CDBSidebarContent>
                </CDBSidebar>
            </div>
        </>
    );
};

export default MenteeSidebar;
