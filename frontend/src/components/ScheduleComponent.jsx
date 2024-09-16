import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { useNavigate } from 'react-router-dom';
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import MenteeSidebar from "../pages/mentees/MenteeSidebar";
import { formatISO, isBefore, startOfToday } from "date-fns"; // Import date-fns for date manipulation
import { padding } from "@mui/system";
import { Modal, Button, Form } from 'react-bootstrap';
import { format } from 'date-fns';

const ScheduleComponent = ({ mentorId }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const navigate = useNavigate();
  const [availableDates, setAvailableDates] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [email, setEmail] = useState(localStorage.getItem("email"));
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const [forcal, setForcal] = useState([{ title: "", date: "" }]);
  const myParam = queryParams.get("mentor");
  const [showmodal, setShowmodal] = useState(false)
  const [Date1, setDate] = useState(null)
  const [Time1, setTime] = useState(null)
  const [description, setDescription] = useState('');
  useEffect(() => {
    fetchAvailability();
  }, [myParam, email]);

  const fetchAvailability = async () => {
    try {
      const uemail = localStorage.getItem("email");
      console.log(uemail);
      const res = await axios.post(
        "http://127.0.0.1:8000/api/mentors/get-mentor-availability/",
        { uemail, myParam }
      );
      console.log(res.data);
      const dates = res.data.availabilities.map((item) => new Date(item.date));
      setAvailableDates(dates);
      const formattedEvents = res.data.availabilities.map((item) => {
        // Determine the color based on the status
        const color = item.status ? 'red' : 'green';
    
        // Return the formatted event object
        return {
            title: `${item.start_time} - ${item.end_time}`,
            date: `${item.date}`,
            color: color,
        };
    });
    
      console.log(formattedEvents);
      setForcal(formattedEvents);
    } catch (error) {
      console.error("Error fetching availability:", error);
      setAvailableDates([]); // Ensure availableDates is an empty array in case of error
    }
  };
  const handleDateClick = (info) => {
    alert("Date clicked: " + info.dateStr);
  };

  useEffect(() => {
    const handleError = (e) => {
      if (e.message === 'ResizeObserver loop completed with undelivered notifications.') {
        const resizeObserverError = e;
        resizeObserverError.stopImmediatePropagation();
      }
    };

    window.addEventListener('error', handleError);

    return () => {
      window.removeEventListener('error', handleError);
    };
  }, []);



  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const isDateAvailable = (date) => {
    return availableDates.some((d) => d.toDateString() === date.toDateString());
  };

  const handleDateChange = (date) => {
    console.log(date);
    console.log(myParam);
    setSelectedDate(date);
    setSelectedTime(null);

    // Fetch available times for the selected date
    fetchAvailableTimes(formatDate(date), myParam);
  };

  const fetchAvailableTimes = async (date, myParam) => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/mentors/get-slot-on-date/",

        { email, date, myParam }
      );
      console.log(res.data); // Check the structure of res.data

      setAvailableTimes(res.data.times || []);
    } catch (error) {
      console.error("Error fetching available times:", error);
      setAvailableTimes([]); // Ensure availableTimes is an empty array in case of error
    }
  };

  
  const handleEventClick = async (info) => {
    const eventTitle = info.event.title; // Get the event title
    const eventDate = info.event.startStr; // Get the event start date (ISO format)
    const eventColor = info.event.backgroundColor; // Get the event color
  
    // Check if the event color is red (indicating it's booked)
    if (eventColor === 'red') {
      toast.error("This time slot is already booked.");
      return; 
    }
  
    // Log event details if the slot is available
    console.log(`Event Title: ${eventTitle}`);
    console.log(`Event Date: ${eventDate}`);
    setDate(eventDate);
    setShowmodal(true);
    setTime(eventTitle);
  };
  
  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const handleBooking = async () => {
    console.log(Date1, Time1, description);
    if (!Date1 || !Time1) {
      toast.error("Please select both a date and a time.");
      return;
    }
    if (!description.trim()) {
      toast.error("Please provide a reason for the appointment.");
      return;
    }
    const email = localStorage.getItem('email');
  
    const bookingData = {
      mentor_id: myParam,
      date: Date1,
      time: Time1,
      email: email,
      reason: description
    };
  
    console.log(bookingData);
  
    try {
      await axios.post(
        "http://localhost:8000/api/mentors/book_session/",
        bookingData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("Session booked successfully!");
      setEmail(email);
      navigate('/confirm-session'); 
    } catch (error) {
      console.error("Error booking session:", error);
      toast.error("Error booking session. Please try again.");
    }
  };

  // Inline styles for available dates
  const dayStyle = (date) => {
    return {
      backgroundColor: isDateAvailable(date) ? "green" : "transparent",
      color: isDateAvailable(date) ? "white" : "black",
      borderRadius: "50%",
      width: "2rem",
      height: "2rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    };
  };
  const handleDateClick2 = (info) => {
    if (isBefore(new Date(info.dateStr), startOfToday())) {
      // Prevent interaction with past dates
      return;
    }
    alert("Date clicked: " + info.dateStr);
  };
  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleDayCellDidMount = (info) => {
    const cellDate = new Date(info.date);
    if (isBefore(cellDate, startOfToday())) {
      // Disable past dates by adding a class
      info.el.style.pointerEvents = "none"; // Prevent clicks
      info.el.style.opacity = "0.5"; // Make it look disabled
    }
  };

 
  return (
    <div
      className="schedule-component"
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <div>
        <MenteeSidebar />
      </div>



      <Modal 
      show={showmodal} 
      >
      <Modal.Header showmodal >
        <Modal.Title>Confirm Your Appointment</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div >

        {Date1 && 
        <h1 style={{color:'white', width:'100%', backgroundColor:'black', textAlign:'center', padding:'10px', borderRadius:'30px', fontSize:'20px'}}>{Date1}</h1>}
        </div>
        <div style={{padding:'20px', backgroundColor:'lightgray', borderRadius:'20px', marginTop:'10px'}}>
          <p style={{textAlign:'center', fontSize:'20px'}}>{Time1}</p>
        </div>
        <Form.Group controlId="descriptionBox" style={{paddingBlock:'20px', paddingInline:'10px'}}>
  {/* <Form.Label>Description</Form.Label>   */}
  {/* <Form.Control
    as="textarea"
    rows={3}
    placeholder="reason"
  /> */}
  <input type="text" style={{width:'450px', height:'100px', padding:'10px'}} placeholder="reason" onChange={(e)=>setDescription(e.target.value)} />
</Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary"
         onClick={()=>setShowmodal(false)}
         >
          Close
        </Button>
        <Button variant="primary" 
        onClick={handleBooking}
        >
          Confirm Booking
        </Button>
      </Modal.Footer>
    </Modal>



      <div
        className="calendar-container"
        style={{
          marginBlock: "50px",
          width: "100%",
          paddingBlock: "50px",
          paddingInline: "30px",
          overflowY: "scroll",
          overflowX: "hidden",
          scrollBehavior: "smooth",
        }}
      >
        {/* <h3>Schedule a Session</h3> */}

        <FullCalendar
          className="full-calendar"
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          datesSet={(dates) => console.log(dates)}
          events={forcal}
          // dateClick={handleDateClick}
          eventClick={handleEventClick}
          dayCellDidMount={handleDayCellDidMount}
        />
      </div>
      {selectedDate && availableTimes.length > 0 && (
        <div className="time-slots-container" style={{ marginTop: "20px" }}>
          <h4>Available Times</h4>
          <ul className="time-slots" style={{ listStyle: "none", padding: 0 }}>
            {availableTimes.map((slot, index) => (
              <li
                key={index}
                className={`time-slot ${
                  selectedTime === slot.start_time ? "selected" : ""
                }`}
                onClick={() => handleTimeSelect(slot.start_time)}
                style={{
                  padding: "10px",
                  marginBottom: "5px",
                  cursor: "pointer",
                  borderRadius: "5px",
                  backgroundColor:
                    selectedTime === slot.start_time ? "#d3d3d3" : "white",
                  border: "1px solid #ccc",
                }}
              >
                {slot.start_time} - {slot.end_time}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ScheduleComponent;
