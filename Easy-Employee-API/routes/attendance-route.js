const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendance-controller');
// Import asyncMiddleware at the top of the file
const asyncMiddleware = require('../middlewares/async-middleware');

// Define your routes using the controller methods
router.post('/attendance', attendanceController.addAttendance);
router.get('/attendance', attendanceController.getAttendance);
router.put('/attendance/:id', attendanceController.updateAttendanceStatus);
router.delete('/attendance/:id', attendanceController.deleteAttendance);


// Add the PATCH route for updating attendance status
router.patch('/admin/update-attendance-status/:id', asyncMiddleware(attendanceController.updateAttendanceStatus)); 

// Add the missing route for updating attendance status
router.patch('/update-status/:id', asyncMiddleware(attendanceController.updateAttendanceStatus));

module.exports = router;
