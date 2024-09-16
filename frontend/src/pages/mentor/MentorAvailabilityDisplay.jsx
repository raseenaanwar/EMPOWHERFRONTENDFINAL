import { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Typography,
  Button,
  Paper,
  FormControl,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import MentorSidebar from "../../components/MentorSideBar";
import "../../css/MentorDisplay.css";
import { Table } from "react-bootstrap";
import "../../css/HorizontalTable.css"; // Import your CSS file

const MentorAvailabilityDisplay = () => {
  const [availabilities, setAvailabilities] = useState([]);
  const [mentorData, setMentorData] = useState({});
  const [url, setUrl] = useState("");
  const navigate = useNavigate();
  const email = localStorage.getItem("email");

  useEffect(() => {
    if (email) {
      fetchAvailability();
    }
  }, [email]);

  const fetchAvailability = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/mentors/get-mentor-availability2/",
        { email }
      );
      console.log(res.data); // Check the structure of res.data

      setAvailabilities(res.data.availabilities || []);
      setMentorData(res.data.mentor_profile || {});
      setUrl(res.data.mentor_profile?.video_call_url || ""); // Example of setting URL
    } catch (error) {
      console.error("Error fetching availability:", error);
      setAvailabilities([]); // Ensure availabilities is an empty array in case of error
    }
  };

  if (!Array.isArray(availabilities)) {
    return <div>No availability data</div>;
  }

  // Group availabilities by date
  const groupedAvailabilities = availabilities.reduce((acc, slot) => {
    console.log(availabilities);
    const { date, start_time, end_time, status } = slot;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push({ start: start_time, end: end_time, status: status });
    return acc;
  }, {});

  return (
    <>
      <div>
        <MentorSidebar />
      </div>
      <div
        style={{ marginTop: "100px", marginLeft: "300px", overflow: "scroll" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "10px",
          }}
        >
          <div>
            URL:
            <input
              type="url"
              value={url}
              disabled
              style={{ width: "350px", height: "50px", padding: "10px" }}
            />
          </div>
          <div>
            <Button
              variant="contained"
              onClick={() =>
                navigate("/mentor-availability", {
                  state: { availabilities, mentorData },
                })
              }
              color="primary"
              style={{ width: "260px", padding: "10px" }}
            >
              Add Time Slots
            </Button>
          </div>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th
                style={{
                  border: "1px solid #ddd",
                  padding: "8px",
                  backgroundColor: "#f2f2f2",
                  textAlign: "left",
                }}
              >
                Date
              </th>
              <th
                style={{
                  border: "1px solid #ddd",
                  padding: "8px",
                  backgroundColor: "#f2f2f2",
                  textAlign: "left",
                }}
              >
                Time Slots
              </th>
            </tr>
          </thead>
          <tbody id="availabilityTable">
            {Object.keys(groupedAvailabilities).length > 0 ? (
              Object.keys(groupedAvailabilities).map((date) => (
                <tr key={date}>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {date}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {groupedAvailabilities[date].map((slot, index) =>
                      slot.status === true ?
                      (
                        <div key={index} style={{ marginBottom: "5px", backgroundColor:'green', padding:'10px', color:'white' }}>
                          {slot.start} - {slot.end}
                        </div>
                      )
                       : (
                        <div key={index} style={{ marginBottom: "5px", padding:'10px' }}>
                          {slot.start} - {slot.end}
                        </div>
                      )
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" style={{ textAlign: "center" }}>
                  No availability data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default MentorAvailabilityDisplay;
