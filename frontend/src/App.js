import  { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import { cloneElement } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import HomePage from './pages/HomePage';
import RegistrationPage from './pages/RegistrationPage';
import { Routes, Route, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
// import UserProfileMentorPage from './pages/mentor/MentorDashboard';
import VerifyEmail from './pages/VerifyEmail';
import ForgetPassword from './pages/ForgetPassword';
import MenteeDashboard from './pages/mentees/MenteeDashboard';
import MentorDashboard from './pages/mentor/MentorDashboard';
import LoginPage from './pages/LoginPage';
import ResetPassword from './pages/ResetPassword';
import CustomNavbar from './components/CustomNavbar';
import AxiosInstance from './axiosinstance';
// import MentoringSessionsPage from './pages/mentor/MentoringSessionsPage';
// import MentorChatPage from './pages/mentor/MentorChatPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import MentorList from './pages/admin/MentorList';
import MenteeList from './pages/admin/MenteeList';
import AdminSideBar from './components/AdminSideBar';
// import WellWisherList from './pages/admin/WellWisherList';
import GeneralProfile from './pages/mentor/GeneralProfile';
import MentorProfile from './pages/mentor/MentorProfile';
import GeneralProfileComponent from './components/GeneralProfileComponent';
import MentorProfileComponent from './components/MentorProfileComponent';
import MentorDetail from './components/MentorDetail';
import Find_Mentor from './components/Find_Mentor';
import MentorAvailability from './pages/mentor/MentorAvailability';
import MentorAvailabilityDisplay from './pages/mentor/MentorAvailabilityDisplay';
import ScheduleComponent from './components/ScheduleComponent';
import MenteeGeneralProfile from './pages/mentees/MenteeGeneralProfile';
import MenteeGeneralProfileComponent from './pages/mentees/MenteeGeneralProfileComponent';
import MenteeProfile from './pages/mentees/MenteeProfile';
import MenteeProfileComponent from './pages/mentees/MenteeProfileComponent';
import ConfirmSession from './pages/mentees/ConfirmSession';
import ChatComponent from './components/ChatComponent';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is authenticated
    const isAuthenticated = () => {
      if (localStorage.getItem('token') !== null){
        return true
      }else{
        return false
      }
    };
    console.log(isAuthenticated())
    setIsLoggedIn(isAuthenticated());
  }, []); // Run this effect only once after the initial render


  


  const handleLogout = () => {
    // Perform logout logic
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <div className="App">
        <CustomNavbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
        <ToastContainer />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/otp/verify" element={<VerifyEmail />} />
          <Route path="/login" element={<LoginPage onLogin={setIsLoggedIn} />} />
          <Route path="/forget_password" element={<ForgetPassword />} />
          <Route path="/password-reset-confirm/:uid/:token" element={<ResetPassword />} />
          <Route path="/mentee-dashboard" element={<MenteeDashboard />} />
          <Route path="/mentor-dashboard" element={<MentorDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/mentor-list" element={<MentorList />} />
          <Route path="/mentee-list" element={<MenteeList />} />
          
          <Route path="/general-profile-component" element={<GeneralProfileComponent />} />
          <Route path="/general-profile" element={<GeneralProfile />} />
          <Route path="/mentor-profile-component" element={<MentorProfileComponent />} />
          <Route path="/mentor-profile" element={<MentorProfile />} />
          <Route path="/find-mentor" element={<Find_Mentor />} />
          <Route path="/mentor-detail/:id" element={<MentorDetail />} />
          <Route path="/mentor-availability" element={<MentorAvailability/>}/>
          <Route path="/mentor-availability-display" element={<MentorAvailabilityDisplay/>}/>
          <Route path="/schedule" element={<ScheduleComponent/>}/>

          <Route path="/mentee-general-profile-component" element={<MenteeGeneralProfileComponent />} />
          <Route path="/mentee-general-profile" element={<MenteeGeneralProfile />} />
          <Route path="/mentee-profile-component" element={<MenteeProfileComponent />} />
          <Route path="/mentee-profile" element={<MenteeProfile />} />
          <Route path="/confirm-session" element={<ConfirmSession />} /> 
          <Route path="/chat" element={<ChatComponent />} /> 
          
        </Routes>
    </div>
  );
}

export default App;
