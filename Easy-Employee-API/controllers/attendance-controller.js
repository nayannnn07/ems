const Attendance = require('../models/attendance-model');

// Define controller functions here
const addAttendance = async (req, res) => {
  try {
    const { employeeID, year, month, date, day, present } = req.body;
    const attendance = new Attendance({ employeeID, year, month, date, day, present });
    await attendance.save();
    return res.status(201).json({ message: "Attendance created successfully", attendance });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

const getAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find();
    return res.status(200).json(attendance);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

const updateAttendanceStatus = async (req, res) => {
    try {
      const attendanceID = req.params.id;
      const { present } = req.body;  // Just get 'present' if that's all you're updating
      
      const attendance = await Attendance.findByIdAndUpdate(
        attendanceID, 
        { present }, 
        { new: true }
      );
      
      if (!attendance) {
        return res.status(404).json({ message: "Attendance not found" });
      }
      
      return res.status(200).json({ 
        message: "Attendance updated successfully", 
        attendance 
      });
    } catch (error) {
      return res.status(500).json({ message: "Server error", error });
    }
  };
  

const deleteAttendance = async (req, res) => {
  try {
    const attendanceID = req.params.id;
    const attendance = await Attendance.findByIdAndDelete(attendanceID);
    if (!attendance) {
      return res.status(404).json({ message: "Attendance not found" });
    }
    return res.status(200).json({ message: "Attendance deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  addAttendance,
  getAttendance,
  updateAttendanceStatus,
  deleteAttendance,
};
