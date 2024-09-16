import { useEffect, useState } from "react";
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
import DeleteIcon from "@mui/icons-material/Delete";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import MentorSidebar from "../../components/MentorSideBar";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MentorAvailability = () => {
  const [selectedDate, setSelectedDate] = useState();
  const [sessionDuration, setSessionDuration] = useState(30);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [availabilities, setAvailabilities] = useState([]);
  const [videoCallUrl, setVideoCallUrl] = useState("");
  const [alert, setAlert] = useState("");
  const [isHovered, setIsHovered] = useState(null);
  const [hoverDate, setHoverDate] = useState(null);

  const [selectedSlots, setSelectedSlots] = useState([]);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState({});
  const [error, setError] = useState("");
  const email = localStorage.getItem("email");

  useEffect(() => {
    setSessionDuration(30);
    setAvailableSlots(generateTimeSlots(30));
  }, []);

  const generateTimeSlots = (duration) => {
    const slots = [];
    let startTime = 0; // starting at 0 hours (12:00 AM)
    const endTime = 24; // ending at 24 hours (12:00 AM next day)

    while (startTime < endTime) {
      const startHour = Math.floor(startTime);
      const startMinutes = (startTime % 1) * 60;
      const endHour = Math.floor(startTime + duration / 60);
      const endMinutes = ((startTime + duration / 60) % 1) * 60;

      const formatTime = (hour, minutes) => {
        const ampm = hour >= 12 ? "PM" : "AM";
        const adjustedHour = hour % 12 === 0 ? 12 : hour % 12;
        const formattedMinutes = minutes === 0 ? "00" : minutes;
        return `${adjustedHour}:${formattedMinutes} ${ampm}`;
      };

      const slot = `${formatTime(startHour, startMinutes)} - ${formatTime(
        endHour,
        endMinutes
      )}`;
      slots.push(slot);
      startTime += duration / 60;
    }

    return slots;
  };

  const handleDateChange = (date) => {
    console.log(date);
    setSelectedDate(date);
  };

  const handleSessionDurationChange = (event) => {
    const duration = parseInt(event.target.value);
    setSessionDuration(duration);
    setAvailableSlots(generateTimeSlots(duration));
    setSelectedSlots([]); // Clear selected slots when duration changes
  };

  const handleSlotSelection = (event) => {
    setSelectedSlots(event.target.value);
  };

  const isTimeInSlot = (slotStart, slotEnd, checkTime) => {
    // Convert time strings to Date objects
    const start = new Date(`1970-01-01T${slotStart}Z`);
    const end = new Date(`1970-01-01T${slotEnd}Z`);
    const slot = new Date(`1970-01-01T${checkTime}Z`);
    return slot >= start && slot < end;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  function convertTimeFormat(timeStr) {
    const timeRegex = /(\d{1,2}):(\d{2})\s*(AM|PM)/i;
    const match = timeStr.match(timeRegex);

    if (!match) {
      throw new Error("Invalid time format");
    }
    let [, hours, minutes, period] = match;
    hours = parseInt(hours, 10);
    minutes = parseInt(minutes, 10);

    if (period.toUpperCase() === "PM" && hours !== 12) {
      hours += 12;
    }
    if (period.toUpperCase() === "AM" && hours === 12) {
      hours = 0;
    }

    const formattedHours = hours.toString().padStart(2, "0");
    const formattedMinutes = minutes.toString().padStart(2, "0");
    const formattedSeconds = "00"; // Always '00' for the seconds

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }
  const handleAddTimeSlots = () => {
    if (!selectedDate) {
      toast.warning("Please select your date");
      return;
    }
    const dateKey = selectedDate.toDateString();
    const existingSlots = selectedTimeSlots[dateKey] || [];

    const newSlots = selectedSlots.filter((slot) => {
      const [start, end] = slot.split(" - ");
      return !availabilities.some((available) => {
        return (
          available.date === formatDate(dateKey) &&
          (isTimeInSlot(
            available.start_time,
            available.end_time,
            convertTimeFormat(start)
          ) ||
            isTimeInSlot(
              available.start_time,
              available.end_time,
              convertTimeFormat(end)
            ))
        );
      });
    });

    // Show error messages for slots that are already booked
    selectedSlots.forEach((slot) => {
      const [start, end] = slot.split(" - ");
      if (
        availabilities.some((available) => {
          return (
            available.date === formatDate(dateKey) &&
            (isTimeInSlot(
              available.start_time,
              available.end_time,
              convertTimeFormat(start)
            ) ||
              isTimeInSlot(
                available.start_time,
                available.end_time,
                convertTimeFormat(end)
              ))
          );
        })
      ) {
        toast.error(`Your time ${start} is already booked`);
      }
    });

    if (newSlots.length === 0) {
      return; // Do not add any slots if all selected slots are already booked
    }

    if (hasOverlappingSlots(newSlots.concat(existingSlots))) {
      setError("Selected time slots overlap with existing slots.");
      return;
    }

    setError(""); // Clear any existing errors

    setSelectedTimeSlots((prev) => {
      const updatedSlots = {
        ...prev,
        [dateKey]: (prev[dateKey] || []).concat(newSlots),
      };

      // Remove date if all slots are deleted
      if (updatedSlots[dateKey].length === 0) {
        delete updatedSlots[dateKey];
      }

      return updatedSlots;
    });

    setSelectedSlots([]);
  };

  const hasOverlappingSlots = (slots) => {
    const slotTimes = slots.map((slot) => {
      if (!slot) {
        return;
      }
      const [start, end] = slot.split(" - ").map((time) => {
        const [hour, minute, period] = time.split(/[: ]/);
        const hours =
          period === "PM" ? (parseInt(hour) % 12) + 12 : parseInt(hour) % 12;
        return hours * 60 + parseInt(minute);
      });
      return { start, end };
    });

    for (let i = 0; i < slotTimes.length; i++) {
      for (let j = i + 1; j < slotTimes.length; j++) {
        if (
          slotTimes[i].end > slotTimes[j].start &&
          slotTimes[i].start < slotTimes[j].end
        ) {
          return true; // Found an overlap
        }
      }
    }
    return false; // No overlaps
  };

  const handleRemoveTimeSlot = (dateKey, slot) => {
    setSelectedTimeSlots((prev) => {
      const updatedSlots = {
        ...prev,
        [dateKey]: prev[dateKey].filter((s) => s !== slot),
      };

      // Remove date if all slots are deleted
      if (updatedSlots[dateKey].length === 0) {
        delete updatedSlots[dateKey];
      }

      return updatedSlots;
    });
  };
  const isValidUrl = (url) => {
    const regex = /^(ftp|http|https):\/\/[^ "]+$/;
    return regex.test(url);
  };

  const handleSubmit = async () => {
    // Validate video call URL
    if (!isValidUrl(videoCallUrl)) {
      toast.error("Please enter a valid video call URL.");
      return;
    }

    // Check if at least one time slot is selected
    const hasAvailability = Object.keys(selectedTimeSlots).some(
      (dateKey) => selectedTimeSlots[dateKey].length > 0
    );
    if (!hasAvailability) {
      toast.error("Please select at least one time slot.");
      return;
    }

    // Prepare data for submission
    const availabilityData = [];

    Object.keys(selectedTimeSlots).forEach((dateKey) => {
      const slots = selectedTimeSlots[dateKey];
      if (!slots) return;
      slots.forEach((slot) => {
        if (!slot) return;
        const [startTimeStr, endTimeStr] = slot.split(" - ");
        const [startHour, startMinute, startPeriod] =
          startTimeStr.split(/[: ]/);
        const [endHour, endMinute, endPeriod] = endTimeStr.split(/[: ]/);
        const startTime = `${
          startPeriod === "PM" && parseInt(startHour) !== 12
            ? parseInt(startHour) + 12
            : startHour
        }:${startMinute}`;
        const endTime = `${
          endPeriod === "PM" && parseInt(endHour) !== 12
            ? parseInt(endHour) + 12
            : endHour
        }:${endMinute}`;
        const duration = sessionDuration;
        const dateObj = new Date(dateKey);

        // Get the local year, month, and day
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, "0"); // Months are 0-based, so add 1
        const day = String(dateObj.getDate()).padStart(2, "0");

        // Format the date into YYYY-MM-DD
        const formattedDate = `${year}-${month}-${day}`;
        console.log(formattedDate);
        availabilityData.push({
          date: formattedDate,
          start_time: startTime,
          end_time: endTime,
          duration,
        });
      });
    });

    const data = {
      session_duration: sessionDuration,
      video_call_url: videoCallUrl,
      availability: availabilityData,
      email,
    };

    try {
      await axios.post(
        "http://127.0.0.1:8000/api/mentors/mentor-availability/",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("Availability saved successfully!");
      setAlert("kjhkjh");
      // Clear selected slots after successful submission
      setSelectedTimeSlots({});
      setSelectedSlots([]);
      setAlert("tretre");
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while saving availability.");
    } finally {
      fetchData();
    }
  };
  const fetchData = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/mentors/get-mentor-availability2/",
        { email }
      );
      const existingData = res.data;
      console.log("getting data", existingData);
      if (existingData.mentor_profile) {
        setVideoCallUrl(existingData.mentor_profile?.video_call_url || "");
      }
      const processedData = res.data.availabilities.map((item) => ({
        date: item.date,
        start_time: item.start_time,
        end_time: item.end_time,
        status: item.status
      }));
      console.log(processedData);
      setAvailabilities(processedData);
    } catch (error) {
      console.error("Error fetching existing availability:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [email, alert, fetchData]);

  const formatDate2 = (dateString) => {
    const date = new Date(dateString);
    const options = {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  // const handleDeleteClick = async (date, start, end) => {
  //   const response = await axios.post(
  //     "http://localhost:8000/api/mentors/delete-mentor-availability/",
  //     { email: email, date: date, start: start, end: end }
  //   );
  //   console.log(start)
  //   setAlert(`${start}`);
  //   toast.success(response.data["message"]);
  //   setAlert('')
  // };
  const handleDeleteClick = async (date, start, end) => {
    try {
      // Send delete request
      const response = await axios.post(
        "http://localhost:8000/api/mentors/delete-mentor-availability/",
        { email: email, date: date, start: start, end: end }
      );

      // Notify user of success
      toast.success(response.data["message"]);
      setAlert(`Deleted: ${start}`);

      // Fetch the updated list of availabilities
      // fetchData();  // Refetch data to update the UI
    } catch (error) {
      console.error("Error deleting availability:", error);
      toast.error("Failed to delete availability");
    } finally {
      setAlert(""); // Clear alert message
    }
  };

  const disablePastDates = ({ date, view }) => {
    // Disable all dates before today
    return date < new Date();
  };

  const groupedAvailabilities = availabilities.reduce((acc, slot) => {
    const { date, start_time, end_time, status } = slot;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push({ start: start_time, end: end_time, status: status });
    return acc;
  }, {});

  const mouseEnter = (slot, index) => {
    setHoverDate(slot);
    setIsHovered(index);
  };

  // Handle mouse leave
  const mouseLeave = () => {
    setHoverDate(null);
    setIsHovered(null);
  };

  return (
    <Container className="w-100" sx={{ mt: 15 }}>
      <MentorSidebar />

      <div>
        <Grid
          container
          spacing={3}
          ml={10}
          sx={{ display: "flex", justifyContent: "center" }}
        >
          <div style={{ padding: "30px" }}>
            <Typography variant="h4" align="center" gutterBottom>
              Mentor Availability
            </Typography>

            <Grid
              item
              xs={12}
              md={3}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            ></Grid>
            <Grid item xs={6} md={16} boxShadow={10}>
              <Calendar
                onChange={handleDateChange}
                value={selectedDate}
                tileDisabled={disablePastDates}
              />
            </Grid>
          </div>

          <div style={{ padding: "30px", margin: "40px" }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <label>Video Call URL</label>
                <input
                  type="text"
                  value={videoCallUrl}
                  onChange={(e) => setVideoCallUrl(e.target.value)}
                  style={{
                    width: "100%", // Use full width of the FormControl
                    border: "1px solid #ccc", // Add border
                    padding: "10px", // Add padding for better appearance
                    borderRadius: "4px", // Optional: rounded corners
                    height: "60px",
                  }}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} style={{ paddingTop: "20px" }}>
              <FormControl>
                <label>Session Duration</label>
                <Select
                  value={sessionDuration}
                  onChange={handleSessionDurationChange}
                  displayEmpty
                  style={{ width: "260px" }}
                >
                  <MenuItem value={30}>30 minutes</MenuItem>
                  <MenuItem value={45}>45 minutes</MenuItem>
                  <MenuItem value={60}>60 minutes</MenuItem>
                  <MenuItem value={90}>90 minutes</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} style={{ paddingTop: "20px" }}>
              <FormControl>
                <label>Available Time Slots</label>
                <Select
                  multiple
                  value={selectedSlots}
                  onChange={handleSlotSelection}
                  renderValue={(selected) => selected.join(", ")}
                  style={{ width: "260px" }}
                >
                  {availableSlots.map((slot) => (
                    <MenuItem key={slot} value={slot}>
                      {slot}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} style={{ paddingTop: "10px" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddTimeSlots}
                style={{ width: "260px", padding: "10px" }}
              >
                Add Time Slots
              </Button>
            </Grid>
          </div>
          <div
            style={{ width: "100%", display: "flex", justifyContent: "center" }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              style={{ width: "500px" }}
            >
              Submit Availability
            </Button>
          </div>
          <Grid item xs={6}>
            <Typography variant="h6">Available dates</Typography>

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
                  {/* <th
                    style={{
                      border: "1px solid #ddd",
                      padding: "8px",
                      backgroundColor: "#f2f2f2",
                      textAlign: "left",
                    }}
                  >
                    Actions
                  </th> */}
                </tr>
              </thead>
              <tbody id="availabilityTable">
                {Object.keys(groupedAvailabilities).length > 0 ? (
                  Object.keys(groupedAvailabilities).map((date) => (
                    <tr key={date}>
                      <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                        {formatDate2(date)}
                      </td>
                      <td
                        style={{
                          border: "1px solid #ddd",
                          padding: "8px",
                          display: "flex",
                          flexDirection: "column",
                          textAlign: "center",
                        }}
                      >
                        {groupedAvailabilities[date].map((slot, index) => (
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-around",
                            }}
                          >
                            <div
                              key={index}
                              style={{
                                marginBottom: "5px",
                                padding:'10px',
                                backgroundColor:
                                  slot.status === true ? "green" : "",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                borderRadius:'20px',
                              color:
                              slot.status === true ? "white" : "",
                              }}
                              onMouseEnter={() => mouseEnter(slot, index)}
                              onMouseLeave={mouseLeave}
                            >
                              <div>
                                {slot.start} - {slot.end}
                              </div>
                            </div>
                            <div>
                              {slot.status === true ? null : (
                                <DeleteIcon
                                  style={{ cursor: "pointer", height: "15px" }}
                                  onClick={() =>
                                    handleDeleteClick(
                                      date,
                                      slot.start,
                                      slot.end
                                    )
                                  }
                                />
                              )}
                            </div>
                          </div>
                        ))}
                      </td>
                      {/* <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                        {groupedAvailabilities[date].map((slot, index) => (
                          <div key={index} style={{ marginBottom: "5px" }}>
                            <Button
                              variant="contained"
                              color="secondary"
                              onClick={() =>
                                handleDeleteClick(date, slot.start, slot.end)
                              }
                            >
                              Delete
                            </Button>
                          </div>
                        ))}
                      </td> */}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" style={{ textAlign: "center" }}>
                      No availability data
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <Paper>
              <Typography variant="h6"></Typography>
              <List></List>
            </Paper>
          </Grid>

          <Grid item xs={6}>
            {Object.keys(selectedTimeSlots).map((dateKey) => (
              <Paper
                key={dateKey}
                style={{
                  margin: "10px 0",
                  padding: "10px",
                  border: "1px solid black",
                }}
              >
                <Typography variant="h6">{dateKey}</Typography>
                <List>
                  {selectedTimeSlots[dateKey].map((slot, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={slot} />
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleRemoveTimeSlot(dateKey, slot)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItem>
                  ))}
                </List>
              </Paper>
            ))}
          </Grid>

          <Grid
            item
            xs={12}
            style={{ display: "flex", justifyContent: "center" }}
          ></Grid>
        </Grid>
      </div>
      {error && (
        <Snackbar
          open={Boolean(error)}
          autoHideDuration={6000}
          onClose={() => setError("")}
        >
          <Alert onClose={() => setError("")} severity="error">
            {error}
          </Alert>
        </Snackbar>
      )}
    </Container>
  );
};

export default MentorAvailability;
