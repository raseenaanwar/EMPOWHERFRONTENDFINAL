// import axios from 'axios'
// import React, {useState} from 'react'
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import CustomNavbar from '../components/CustomNavbar';

// const VerifyEmail = () => {
//     const [otp, setOtp]=useState("")
//     const navigate=useNavigate()

//     const handleOtpSubmit = async(e)=>{
//             e.preventDefault()
//             if (otp) {
//                 const res = await axios.post('http://localhost:8000/api/verify-email/', {'otp':otp})
//                 const resp = res.data
//                 if (res.status === 200) {
//                     navigate('/login')
//                     toast.success(resp.message)
//                 }
                
//             }
            
//     }
//   return (
//     <div>
//         {/* <CustomNavbar/> */}
//         <div className='form-container'>
//             <form action="" style={{width:"30%"}}   onSubmit={handleOtpSubmit} >
            
//                <div className='form-group'>
//                  <label htmlFor="">Enter your Otp code:</label>
//                  <input type="text"
//                   className='email-form'  
//                   name="otp"
//                   value={otp}
//                   onChange={(e)=>setOtp(e.target.value)} 
//                    />
//                </div>
//                <button type='submit' className='vbtn'>Send</button>
//             </form>
//         </div>
//     </div>
//   )
// }

// export default VerifyEmail
import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import CustomNavbar from '../components/CustomNavbar';

const VerifyEmail = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (!otp) {
      toast.error('Please enter the OTP');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('http://localhost:8000/api/verify-email/', { otp });
      const resp = res.data;

      if (res.status === 200) {
        toast.success(resp.message);
        navigate('/login');
      } else {
        toast.error('Verification failed. Please try again.');
      }
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        toast.error(error.response.data.message || 'Verification failed. Please try again.');
      } else if (error.request) {
        // The request was made but no response was received
        toast.error('No response from server. Please try again later.');
      } else {
        // Something happened in setting up the request that triggered an Error
        toast.error('Error in sending request. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* <CustomNavbar/> */}
      <div className='form-container'>
        <form style={{ width: '30%' }} onSubmit={handleOtpSubmit}>
          <div className='form-group'>
            <label htmlFor='otp'>Enter your OTP code:</label>
            <input
              type='text'
              className='email-form'
              name='otp'
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              disabled={loading}
            />
          </div>
          <button type='submit' className='vbtn' disabled={loading}>
            {loading ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyEmail;
