// import React, { useState, useEffect } from 'react';
// import AdminSideBar from '../../components/AdminSideBar';
// import axios from 'axios';
// import 'bootstrap/dist/css/bootstrap.min.css';

// const MentorList = () => {
//   const [mentors, setMentors] = useState([]);

//   useEffect(() => {
//     const fetchMentors = async () => {
//       try {
//         const response = await axios.get('http://localhost:8000/api/mentors/mentor-list/');
//         setMentors(response.data);
//       } catch (error) {
//         console.error('Error fetching mentors:', error);
//       }
//     };

//     fetchMentors();
//   }, []);

//   const handleBanClick = async (mentorId) => {
//     try {
//       const response = await axios.put(`http://localhost:8000/api/mentors/${mentorId}/block/`);
//       setMentors(prevMentors => prevMentors.map(mentor => {
//         if (mentor.id === mentorId) {
//           return { ...mentor, is_blocked: !mentor.is_blocked }; // Toggle block status
//         }
//         return mentor;
//       }));
//     } catch (error) {
//       console.error('Error blocking/unblocking mentor:', error);
//     }
//   };

//   return (
//     <div style={{alignItems:'center'}}>
//       <div className='bg-secondary' style={{ marginTop: '100px' }}>
//         <div className='d-flex'>
//           <div className='col-2 bg-white vh-100'>
//             <AdminSideBar />
//           </div>
//           <div className='col'>
//             <div className="mt-2">
//               <h4 className="text-white">List Of Mentors</h4>
//               <table className="table table-striped">
//                 <thead>
//                   <tr>
//                     <th>#</th>
//                     <th>Name</th>
//                     <th>Email</th>
//                     <th>Country</th>
//                     <th>Verified</th>
//                     <th>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {mentors.map((mentor, index) => (
//                     <tr key={mentor.id}>
//                       <td>{index + 1}</td>
//                       <td>{mentor.first_name} {mentor.last_name}</td>
//                       <td>{mentor.email}</td>
//                       <td>{mentor.country}</td>
//                       <td>{mentor.is_verified ? 'Yes' : 'No'}</td>
//                       <td>
//                         <button 
//                           className={`btn ${mentor.is_blocked ? 'btn-success' : 'btn-danger'}`} 
//                           onClick={() => handleBanClick(mentor.id)}
//                         >
//                           {mentor.is_blocked ? 'Unban' : 'Ban'}
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MentorList;
import React, { useState, useEffect } from 'react';
import AdminSideBar from '../../components/AdminSideBar';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Paper, Typography, Container } from '@mui/material';
import { styled } from '@mui/material/styles';

// Custom TableRow component with hover effect
const HoverTableRow = styled(TableRow)(({ theme }) => ({
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const MentorList = () => {
  const [mentors, setMentors] = useState([]);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/mentors/mentor-list/');
        setMentors(response.data);
      } catch (error) {
        console.error('Error fetching mentors:', error);
      }
    };

    fetchMentors();
  }, []);

  const handleBanClick = async (mentorId) => {
    try {
      const response = await axios.put(`http://localhost:8000/api/mentors/${mentorId}/block/`);
      setMentors(prevMentors => prevMentors.map(mentor => {
        if (mentor.id === mentorId) {
          return { ...mentor, is_blocked: !mentor.is_blocked }; // Toggle block status
        }
        return mentor;
      }));
    } catch (error) {
      console.error('Error blocking/unblocking mentor:', error);
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <div className='bg-secondary' style={{ marginTop: '100px', flex: 1 }}>
        <div className='d-flex'>
          <div className='col-2 bg-white vh-100'>
            <AdminSideBar />
          </div>
          <div className='col' style={{ padding: '20px' }}>
            <Container>
              <Typography variant="h4" gutterBottom>
                List Of Mentors
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>#</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Country</TableCell>
                      <TableCell>Verified</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mentors.map((mentor, index) => (
                      <HoverTableRow key={mentor.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{mentor.first_name} {mentor.last_name}</TableCell>
                        <TableCell>{mentor.email}</TableCell>
                        <TableCell>{mentor.country}</TableCell>
                        <TableCell>{mentor.is_verified ? 'Yes' : 'No'}</TableCell>
                        <TableCell>
                          <Button 
                            variant="contained" 
                            color={mentor.is_blocked ? 'success' : 'error'} 
                            onClick={() => handleBanClick(mentor.id)}
                          >
                            {mentor.is_blocked ? 'Unban' : 'Ban'}
                          </Button>
                        </TableCell>
                      </HoverTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Container>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorList;
