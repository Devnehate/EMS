import { Router } from 'express';
import { protect } from '../middleware/Auth.js';
import { clockInOut, getAttendance } from '../controllers/AttendanceController.js';

const attendanceRoutes = Router();

attendanceRoutes.post('/', protect, clockInOut);
attendanceRoutes.get('/', protect, getAttendance);

export default attendanceRoutes;