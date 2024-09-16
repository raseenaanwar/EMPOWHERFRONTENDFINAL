// import AdminSideBar from '../../components/AdminSideBar';
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const MenteeList = () => {
//     const [mentees, setMentees] = useState([]);

//     useEffect(() => {
//         const fetchMentees = async () => {
//             try {
//                 const response = await axios.get('http://localhost:8000/api/mentees/mentee-list/');
//                 setMentees(response.data);
//                 console.log(response.data)
//             } catch (error) {
//                 console.error('Error fetching mentees:', error);
//             }
//         };

//         fetchMentees();
//     }, []);

//     const handleBanClick = async (menteeId) => {
//         try {
//             await axios.put(`http://localhost:8000/api/mentees/${menteeId}/block/`);
//             setMentees(prevMentees => prevMentees.map(mentee => {
//                 if (mentee.id === menteeId) {
//                     return { ...mentee, is_blocked: !mentee.is_blocked };
//                 }
//                 return mentee;
//             }));
//         } catch (error) {
//             console.error('Error blocking mentee:', error);
//         }
//     };

//     return (
//         <div style={{ marginTop: '50px' }}>
//             <div className='bg-secondary'>
//                 <div className='d-flex'>
//                     <div className='col-2 bg-white vh-100'>
//                         <AdminSideBar />
//                     </div>
//                     <div className='col'>
//                         <div className="mt-2">
//                             <h4 className="text-white">List Of Mentees</h4>
//                             <table className="table table-striped">
//                                 <thead>
//                                     <tr>
//                                         <th>#</th>
//                                         <th>Name</th>
//                                         <th>Email</th>
//                                         <th>Country</th>
//                                         <th>Verified</th>
//                                         <th>Actions</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {mentees.map((mentee, index) => (
//                                         <tr key={mentee.id}>
//                                             <td>{index + 1}</td>
//                                             <td>{mentee.first_name} {mentee.last_name}</td>
//                                             <td>{mentee.email}</td>
//                                             <td>{mentee.country}</td>
//                                             <td>{mentee.is_verified ? 'Yes' : 'No'}</td>
//                                             <td>
//                                                 {mentee.is_blocked ? (
//                                                     <button className="btn btn-success" onClick={() => handleBanClick(mentee.id)}>Unban</button>
//                                                 ) : (
//                                                     <button className="btn btn-danger" onClick={() => handleBanClick(mentee.id)}>Ban</button>
//                                                 )}
//                                             </td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default MenteeList;
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

const MenteeList = () => {
  const [mentees, setMentees] = useState([]);

  useEffect(() => {
    const fetchMentees = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/mentees/mentee-list/');
        setMentees(response.data);
      } catch (error) {
        console.error('Error fetching mentees:', error);
      }
    };

    fetchMentees();
  }, []);

  const handleBanClick = async (menteeId) => {
    try {
      await axios.put(`http://localhost:8000/api/mentees/${menteeId}/block/`);
      setMentees(prevMentees => prevMentees.map(mentee => {
        if (mentee.id === menteeId) {
          return { ...mentee, is_blocked: !mentee.is_blocked }; // Toggle block status
        }
        return mentee;
      }));
    } catch (error) {
      console.error('Error blocking/unblocking mentee:', error);
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
                List Of Mentees
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
                    {mentees.map((mentee, index) => (
                      <HoverTableRow key={mentee.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{mentee.first_name} {mentee.last_name}</TableCell>
                        <TableCell>{mentee.email}</TableCell>
                        <TableCell>{mentee.country}</TableCell>
                        <TableCell>{mentee.is_verified ? 'Yes' : 'No'}</TableCell>
                        <TableCell>
                          <Button 
                            variant="contained" 
                            color={mentee.is_blocked ? 'success' : 'error'} 
                            onClick={() => handleBanClick(mentee.id)}
                          >
                            {mentee.is_blocked ? 'Unban' : 'Ban'}
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

export default MenteeList;
