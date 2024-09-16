// ThankYouPage.js
import React from 'react';
import { Link } from 'react-router-dom';

const ConfirmSession = () => {
  return (
    <div style={{ textAlign: 'center', padding: '50px' ,marginTop:'50px'}}>
     
      <p>Your session has been successfully booked.</p>
      <p>We look forward to seeing you!</p>
      <Link to="/">Go to Home</Link> 
    </div>
  );
};

export default ConfirmSession;
