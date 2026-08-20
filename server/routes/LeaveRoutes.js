import {Router} from 'express';
import { protect, protectAdmin } from '../middleware/Auth.js';
import { createLeave, getLeaves, updateLeave } from '../controllers/LeaveController.js';

const leaveRoutes = Router();

leaveRoutes.post('/', protect, createLeave);
leaveRoutes.get('/', protect, getLeaves);
leaveRoutes.patch('/:id', protect, protectAdmin, updateLeave);

export default leaveRoutes;
