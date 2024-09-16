// src/pages/mentor/TimeSlotModal.jsx
import React, { useState, useEffect } from "react";
import { Modal, Button, FormControl, Select, MenuItem } from "@mui/material";
import axios from "axios";

const TimeSlotModal = ({ open, onClose, slotToEdit, onSave, onDelete }) => {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(slotToEdit);

  useEffect(() => {
    // Fetch all time slots to populate dropdown
    const fetchAvailableSlots = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/mentors/get-available-slots/");
        setAvailableSlots(res.data.slots);
      } catch (error) {
        console.error("Error fetching available slots:", error);
      }
    };

    fetchAvailableSlots();
  }, []);

  useEffect(() => {
    if (slotToEdit) {
      setSelectedSlot(slotToEdit);
    }
  }, [slotToEdit]);

  const handleSave = async () => {
    try {
      await axios.post("http://localhost:8000/api/mentors/update-availability/", {
        date: selectedSlot.date,
        start_time: selectedSlot.start,
        end_time: selectedSlot.end,
      });
      onSave();
    } catch (error) {
      console.error("Error saving time slot:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.post("http://localhost:8000/api/mentors/remove-availability/", {
        date: selectedSlot.date,
        start_time: selectedSlot.start,
        end_time: selectedSlot.end,
      });
      onDelete();
    } catch (error) {
      console.error("Error deleting time slot:", error);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div style={{ padding: "20px", backgroundColor: "white", margin: "auto", marginTop: "100px", width: "400px" }}>
        <h2>Edit Time Slot</h2>
        <FormControl fullWidth>
          <Select
            value={selectedSlot.start}
            onChange={(e) => setSelectedSlot({ ...selectedSlot, start: e.target.value })}
          >
            {availableSlots.map((slot) => (
              <MenuItem key={slot.start} value={slot.start}>
                {slot.start} - {slot.end}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button onClick={handleSave} color="primary" variant="contained">Save</Button>
        <Button onClick={handleDelete} color="secondary" variant="contained">Delete</Button>
      </div>
    </Modal>
  );
};

export default TimeSlotModal;
