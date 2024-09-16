import React, { useState, useEffect } from 'react';
import AdminSideBar from '../../components/AdminSideBar';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import axios from 'axios';

const AdminDashboard = () => {
  const [mentors, setMentors] = useState([]);
  const [mentees, setMentees] = useState([]);
  const [wellWishers, setWellWishers] = useState([]);
  const [userCounts, setUserCounts] = useState({ mentors: 0, mentees: 0, wellWishers: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const mentorResponse = await axios.get('http://127.0.0.1:8000/api/mentors/recently-joined-mentors/');
        setMentors(mentorResponse.data);
        
        const menteeResponse = await axios.get('http://127.0.0.1:8000/api/mentors/recently-joined-mentees/');
        setMentees(menteeResponse.data);
        
        // const wellWisherResponse = await axios.get('http://127.0.0.1:8000/api/wellwishers/recently-joined-wellwishers/');
        // setWellWishers(wellWisherResponse.data);

        // Fetch user counts
        const countsResponse = await axios.get('http://127.0.0.1:8000/api/mentors/user-count/');
        setUserCounts(countsResponse.data);
        console.log("COUNT",countsResponse.data)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className='bg-light'>
      <div className='d-flex'>
        <div className='col-2 bg-white vh-100'>
          <AdminSideBar />
        </div>
        <div className='col-10 p-4'>
          <div className='row mb-4'>
            <div className='col-md-4'>
              <div className='card bg-primary text-white'>
                <div className='card-body'>
                  <h5 className='card-title'>Mentors</h5>
                  <p className='card-text'>{userCounts.mentors_count}</p>
                </div>
              </div>
            </div>
            <div className='col-md-4'>
              <div className='card bg-success text-white'>
                <div className='card-body'>
                  <h5 className='card-title'>Mentees</h5>
                  <p className='card-text'>{userCounts.mentees_count}</p>
                </div>
              </div>
            </div>
            <div className='col-md-4'>
              <div className='card bg-info text-white'>
                <div className='card-body'>
                  <h5 className='card-title'>Well-Wishers</h5>
                  <p className='card-text'>{userCounts.wellWishers_count}</p>
                </div>
              </div>
            </div>
          </div>
          <div className='mb-4'>
            <h2 className='text-center mb-4'>Recently Joined Mentors</h2>
            <table className='table table-striped bg-white rounded shadow-sm'>
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Country</th>
                </tr>
              </thead>
              <tbody>
                {mentors.length ? (
                  mentors.map((mentor, index) => (
                    <tr key={mentor.id}>
                      <th scope="row">{index + 1}</th>
                      <td>{mentor.first_name} {mentor.last_name}</td>
                      <td>{mentor.email}</td>
                      <td>{mentor.country}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">No mentors found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className='mb-4'>
            <h2 className='text-center mb-4'>Recently Joined Mentees</h2>
            <table className='table table-striped bg-white rounded shadow-sm'>
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Country</th>
                </tr>
              </thead>
              <tbody>
                {mentees.length ? (
                  mentees.map((mentee, index) => (
                    <tr key={mentee.id}>
                      <th scope="row">{index + 1}</th>
                      <td>{mentee.first_name} {mentee.last_name}</td>
                      <td>{mentee.email}</td>
                      <td>{mentee.country}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">No mentees found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className='mb-4'>
            <h2 className='text-center mb-4'>Recently Joined Well-Wishers</h2>
            <table className='table table-striped bg-white rounded shadow-sm'>
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Country</th>
                </tr>
              </thead>
              <tbody>
                {wellWishers.length ? (
                  wellWishers.map((wellWisher, index) => (
                    <tr key={wellWisher.id}>
                      <th scope="row">{index + 1}</th>
                      <td>{wellWisher.first_name} {wellWisher.last_name}</td>
                      <td>{wellWisher.email}</td>
                      <td>{wellWisher.country}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">No well-wishers found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
