import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import '../css/adminstyle.css';

const AdminSideBar = () => {
  const [active, setActive] = useState(1);

  return (
    <div className='sidebar '>
      <div className='brand'>
        <i className='bi bi-speedometer fs-4 me-3'></i>
        <span className='brand-name fs-3'>Dashboard</span>
      </div>
      <hr className='divider'/>
      <div className='list-group'>
        {/* <Link 
          to="/admin-dashboard" 
          className={`list-group-item ${active === 1 ? 'active' : ''}`}
          onClick={() => setActive(1)}
        >
          <i className='bi bi-house fs-4 me-3'></i>
          <span className='fs-5'>Home</span>
        </Link> */}
        <Link 
          to="/overview" 
          className={`list-group-item ${active === 2 ? 'active' : ''}`}
          onClick={() => setActive(2)}
        >
          <i className='bi bi-bar-chart-line fs-4 me-3'></i>
          <span className='fs-5'>Overview</span>
        </Link>
        <Link 
          to="/mentor-list" 
          className={`list-group-item ${active === 3 ? 'active' : ''}`}
          onClick={() => setActive(3)}
        >
          <i className='bi bi-person fs-4 me-3'></i>
          <span className='fs-5'>Mentors</span>
        </Link>
        <Link 
          to="/mentee-list" 
          className={`list-group-item ${active === 4 ? 'active' : ''}`}
          onClick={() => setActive(4)}
        >
          <i className='bi bi-people fs-4 me-3'></i>
          <span className='fs-5'>Mentees</span>
        </Link>
        <Link 
          to="/wellwisher-list" 
          className={`list-group-item ${active === 5 ? 'active' : ''}`}
          onClick={() => setActive(5)}
        >
          <i className='bi bi-people fs-4 me-3'></i>
          <span className='fs-5'>Wellwishers</span>
        </Link>
        <a 
          href="#donations" 
          className={`list-group-item ${active === 6 ? 'active' : ''}`}
          onClick={() => setActive(6)}
        >
          <i className='bi bi-cash fs-4 me-3'></i>
          <span className='fs-5'>Donations</span>
        </a>
      </div>
    </div>
  );
};

export default AdminSideBar;
