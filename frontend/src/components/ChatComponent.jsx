// import React, { useState, useEffect, useRef } from 'react';
// import ReactDOM from 'react-dom';
// import {
//   Container,
//   Box,
//   Typography,
//   TextField,
//   Button,
//   Paper,
//   List,
//   ListItem,
//   ListItemText,
//   Avatar,
//   Divider,
//   Snackbar,
//   Alert,
//   IconButton,
//   Tooltip,
// } from '@mui/material';
// import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
// import { useMediaQuery } from '@mui/material';
// import { EmojiEmotions, AttachFile } from '@mui/icons-material';

// // Create MUI theme
// const theme = createTheme({
//   palette: {
//     primary: {
//       main: '#1976d2',
//     },
//     secondary: {
//       main: '#dc004e',
//     },
//   },
// });

// // Styled components
// const Sidebar = styled(Box)(({ theme }) => ({
//   width: '250px',
//   backgroundColor: theme.palette.background.paper,
//   borderRight: `1px solid ${theme.palette.divider}`,
//   height: '100vh',
//   overflowY: 'auto',
// }));

// const ChatArea = styled(Box)(({ theme }) => ({
//   flex: 1,
//   display: 'flex',
//   flexDirection: 'column',
//   height: '100vh',
// }));

// const MessageList = styled(Paper)(({ theme }) => ({
//   flex: 1,
//   overflowY: 'auto',
//   padding: theme.spacing(2),
//   marginBottom: theme.spacing(2),
// }));

// const MessageInputArea = styled(Box)(({ theme }) => ({
//   display: 'flex',
//   alignItems: 'center',
//   padding: theme.spacing(1),
// }));

// const TypingIndicator = styled(Typography)(({ theme }) => ({
//   padding: theme.spacing(1),
//   textAlign: 'center',
//   color: theme.palette.text.secondary,
// }));

// const mentorsData = [
//   { id: 1, name: 'John Doe', profession: 'Software Engineer', imageUrl: '/path/to/image1.jpg' },
//   { id: 2, name: 'Jane Smith', profession: 'UX Designer', imageUrl: '/path/to/image2.jpg' },
//   // Add more mentors as needed
// ];

// const ChatComponent = () => {
//   const [selectedMentor, setSelectedMentor] = useState(mentorsData[0]);
//   const [messages, setMessages] = useState([
//     { id: 1, text: 'Hello!', sender: 'user', timestamp: new Date() },
//     { id: 2, text: 'Hi there!', sender: 'mentor', timestamp: new Date() },
//   ]);
//   const [input, setInput] = useState('');
//   const [isTyping, setIsTyping] = useState(false);
//   const [openNotification, setOpenNotification] = useState(false);
//   const [notificationMessage, setNotificationMessage] = useState('');
//   const [messageSearch, setMessageSearch] = useState('');
//   const messageEndRef = useRef(null);

//   const handleMentorClick = (mentor) => {
//     setSelectedMentor(mentor);
//     // Here you could also fetch and set chat history for the selected mentor
//   };

//   const handleSendMessage = () => {
//     if (input.trim()) {
//       const newMessage = {
//         id: messages.length + 1,
//         text: input,
//         sender: 'user',
//         timestamp: new Date(),
//       };
//       setMessages([...messages, newMessage]);
//       setInput('');
//       setIsTyping(false);
//       setNotificationMessage(`New message sent to ${selectedMentor.name}`);
//       setOpenNotification(true);
//     }
//   };

//   const handleFileAttach = (event) => {
//     // Handle file attachment logic
//     console.log('File attached:', event.target.files[0]);
//   };

//   useEffect(() => {
//     // Simulate typing indicator
//     const typingTimer = setTimeout(() => {
//       setIsTyping(false);
//     }, 2000);

//     if (input.trim()) {
//       setIsTyping(true);
//     }

//     return () => clearTimeout(typingTimer);
//   }, [input]);

//   useEffect(() => {
//     // Scroll to bottom of the chat when new messages are added
//     messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   const filteredMessages = messages.filter((msg) =>
//     msg.text.toLowerCase().includes(messageSearch.toLowerCase())
//   );

//   return (
//     <ThemeProvider theme={theme}>
//       <Container
//         maxWidth="lg"
//         sx={{
//           display: 'flex',
//           flexDirection: useMediaQuery((theme) => theme.breakpoints.down('sm')) ? 'column' : 'row',
//           height: '100vh',
//           padding: 0,
//           mt:"100px"
//         }}
//       >
//         <Sidebar>
//           <Typography variant="h6" sx={{ padding: 2 }}>Mentors</Typography>
//           <Divider />
//           <List>
//             {mentorsData.map((mentor) => (
//               <ListItem
//                 button
//                 key={mentor.id}
//                 onClick={() => handleMentorClick(mentor)}
//                 selected={mentor.id === selectedMentor.id}
//               >
//                 <Avatar src={mentor.imageUrl} sx={{ marginRight: 2 }} />
//                 <ListItemText
//                   primary={mentor.name}
//                   secondary={mentor.profession}
//                 />
//               </ListItem>
//             ))}
//           </List>
//         </Sidebar>
//         <ChatArea>
//           <Box sx={{ padding: 2 }}>
//             <Typography variant="h6">{selectedMentor.name}</Typography>
//             <Typography variant="body2" color="textSecondary">{selectedMentor.profession}</Typography>
//           </Box>
//           {isTyping && <TypingIndicator>Typing...</TypingIndicator>}
//           <MessageList>
//             <List>
//               {filteredMessages.map((msg) => (
//                 <ListItem key={msg.id} sx={{ justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
//                   <ListItemText
//                     primary={msg.text}
//                     secondary={<Typography variant="caption">{new Date(msg.timestamp).toLocaleTimeString()}</Typography>}
//                     sx={{
//                       backgroundColor: msg.sender === 'user' ? '#e0f7fa' : '#f1f8e9',
//                       borderRadius: '16px',
//                       padding: '8px 16px',
//                     }}
//                   />
//                 </ListItem>
//               ))}
//               <div ref={messageEndRef} />
//             </List>
//           </MessageList>
//           <MessageInputArea>
//             <IconButton component="label">
//               <AttachFile />
//               <input
//                 type="file"
//                 hidden
//                 onChange={handleFileAttach}
//               />
//             </IconButton>
//             <TextField
//               fullWidth
//               variant="outlined"
//               placeholder="Type a message..."
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               onKeyDown={(e) => {
//                 if (e.key === 'Enter') {
//                   handleSendMessage();
//                 }
//               }}
//             />
//             <Tooltip title="Add Emoji">
//               <IconButton>
//                 <EmojiEmotions />
//               </IconButton>
//             </Tooltip>
//             <Button variant="contained" color="primary" onClick={handleSendMessage} sx={{ marginLeft: 2 }}>
//               Send
//             </Button>
//           </MessageInputArea>
//           <Box sx={{ padding: 1 }}>
//             <TextField
//               fullWidth
//               variant="outlined"
//               placeholder="Search messages..."
//               value={messageSearch}
//               onChange={(e) => setMessageSearch(e.target.value)}
//             />
//           </Box>
//         </ChatArea>
//       </Container>
//       <Snackbar
//         open={openNotification}
//         autoHideDuration={6000}
//         onClose={() => setOpenNotification(false)}
//       >
//         <Alert onClose={() => setOpenNotification(false)} severity="info">
//           {notificationMessage}
//         </Alert>
//       </Snackbar>
//     </ThemeProvider>
//   );
// };

// export default ChatComponent;
import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Divider,
  Snackbar,
  Alert,
  IconButton,
  Tooltip,
} from '@mui/material';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import { EmojiEmotions, AttachFile } from '@mui/icons-material';

// Create MUI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

// Styled components
const Sidebar = styled(Box)(({ theme }) => ({
  width: '250px',
  backgroundColor: theme.palette.background.paper,
  borderRight: `1px solid ${theme.palette.divider}`,
  height: '100vh',
  overflowY: 'auto',
}));

const ChatArea = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
}));

const MessageList = styled(Paper)(({ theme }) => ({
  flex: 1,
  overflowY: 'auto',
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
}));

const MessageInputArea = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1),
}));

const TypingIndicator = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const mentorsData = [
  { id: 1, name: 'John Doe', profession: 'Software Engineer', imageUrl: '/path/to/image1.jpg' },
  { id: 2, name: 'Jane Smith', profession: 'UX Designer', imageUrl: '/path/to/image2.jpg' },
  // Add more mentors as needed
];

const ChatComponent = () => {
  const [selectedMentor, setSelectedMentor] = useState(mentorsData[0]);
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello!', sender: 'user', timestamp: new Date() },
    { id: 2, text: 'Hi there!', sender: 'mentor', timestamp: new Date() },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [openNotification, setOpenNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [messageSearch, setMessageSearch] = useState('');
  const [isAtBottom, setIsAtBottom] = useState(true);
  const messageEndRef = useRef(null);

  const handleMentorClick = (mentor) => {
    setSelectedMentor(mentor);
    // Here you could also fetch and set chat history for the selected mentor
  };

  const handleSendMessage = () => {
    if (input.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: input,
        sender: 'user',
        timestamp: new Date(),
      };
      setMessages([...messages, newMessage]);
      setInput('');
      setIsTyping(false);
      setNotificationMessage(`New message sent to ${selectedMentor.name}`);
      setOpenNotification(true);
    }
  };

  const handleFileAttach = (event) => {
    // Handle file attachment logic
    console.log('File attached:', event.target.files[0]);
  };

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const handleScroll = () => {
      if (messageEndRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = messageEndRef.current.parentElement;
        setIsAtBottom(scrollTop + clientHeight >= scrollHeight - 5);
      }
    };

    const chatArea = messageEndRef.current?.parentElement;
    chatArea?.addEventListener('scroll', handleScroll);

    return () => {
      chatArea?.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (isAtBottom) {
      scrollToBottom();
    }
  }, [messages, isAtBottom]);

  useEffect(() => {
    // Simulate typing indicator
    const typingTimer = setTimeout(() => {
      setIsTyping(false);
    }, 2000);

    if (input.trim()) {
      setIsTyping(true);
    }

    return () => clearTimeout(typingTimer);
  }, [input]);

  const filteredMessages = messages.filter((msg) =>
    msg.text.toLowerCase().includes(messageSearch.toLowerCase())
  );

  return (
    <ThemeProvider theme={theme}>
      <Container
        maxWidth="lg"
        sx={{
          display: 'flex',
          flexDirection: useMediaQuery((theme) => theme.breakpoints.down('sm')) ? 'column' : 'row',
          height: '100vh',
          padding: 0,
          mt:"100px"
        }}
      >
        <Sidebar>
          <Typography variant="h6" sx={{ padding: 2 }}>Mentors</Typography>
          <Divider />
          <List>
            {mentorsData.map((mentor) => (
              <ListItem
                button
                key={mentor.id}
                onClick={() => handleMentorClick(mentor)}
                selected={mentor.id === selectedMentor.id}
              >
                <Avatar src={mentor.imageUrl} sx={{ marginRight: 2 }} />
                <ListItemText
                  primary={mentor.name}
                  secondary={mentor.profession}
                />
              </ListItem>
            ))}
          </List>
        </Sidebar>
        <ChatArea>
          <Box sx={{ padding: 2 }}>
            <Typography variant="h6">{selectedMentor.name}</Typography>
            <Typography variant="body2" color="textSecondary">{selectedMentor.profession}</Typography>
          </Box>
          {isTyping && <TypingIndicator>Typing...</TypingIndicator>}
          <MessageList>
            <List>
              {filteredMessages.map((msg) => (
                <ListItem key={msg.id} sx={{ justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                  <ListItemText
                    primary={msg.text}
                    secondary={<Typography variant="caption">{new Date(msg.timestamp).toLocaleTimeString()}</Typography>}
                    sx={{
                      backgroundColor: msg.sender === 'user' ? '#e0f7fa' : '#f1f8e9',
                      borderRadius: '16px',
                      padding: '8px 16px',
                    }}
                  />
                </ListItem>
              ))}
              <div ref={messageEndRef} />
            </List>
          </MessageList>
          <MessageInputArea>
            <IconButton component="label">
              <AttachFile />
              <input
                type="file"
                hidden
                onChange={handleFileAttach}
              />
            </IconButton>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSendMessage();
                }
              }}
            />
            <Tooltip title="Add Emoji">
              <IconButton>
                <EmojiEmotions />
              </IconButton>
            </Tooltip>
            <Button variant="contained" color="primary" onClick={handleSendMessage} sx={{ marginLeft: 2 }}>
              Send
            </Button>
          </MessageInputArea>
          <Box sx={{ padding: 1 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search messages..."
              value={messageSearch}
              onChange={(e) => setMessageSearch(e.target.value)}
            />
          </Box>
        </ChatArea>
      </Container>
      <Snackbar
        open={openNotification}
        autoHideDuration={6000}
        onClose={() => setOpenNotification(false)}
      >
        <Alert onClose={() => setOpenNotification(false)} severity="info">
          {notificationMessage}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
};

export default ChatComponent;
