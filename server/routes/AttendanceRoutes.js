import { Router } from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { clockInOut, getAttendance } from '../controllers/AttendanceController';

const attendanceRoutes = Router();

attendanceRoutes.post('/', protect, clockInOut);
attendanceRoutes.get('/', protect, getAttendance);

export default attendanceRoutes;