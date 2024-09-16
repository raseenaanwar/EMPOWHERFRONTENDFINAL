
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import AxiosInstance from '../axiosinstance';
import CustomNavbar from '../components/CustomNavbar';

const ForgetPassword = () => {
    const [email, setEmail]=useState("")

    const handleSubmit = async(e)=>{
        e.preventDefault()
        if (email) {
          const res = await AxiosInstance.post('password-reset/', {'email':email})
           if (res.status === 200) {
            console.log(res.data)
            toast.success('a link to reset your password has be sent to your email')
            
           } 
           setEmail("")
        }
        


    }

  
  return (
    <div>
        <CustomNavbar/>
        <br></br><br /><br /><br /><br />
        <h2 style={{ marginLeft: '190px' }}>Enter Your Registered Email</h2>

        <div className='wrapper'>
            <form action="" onSubmit={handleSubmit}>
                 <div className='form-group'>
                 <label htmlFor="">Email Address:</label>
                 <input type="text"
                  className='email-form' 
                   name="email"
                   value={email}
                   onChange={(e)=>setEmail(e.target.value)}
                   />    
               </div>
               <button className='vbtn'>Send</button>
            </form>
        </div>
    </div>
  )
}

export default ForgetPassword
