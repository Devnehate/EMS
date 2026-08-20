import { Router } from 'express';
import { protect, protectAdmin } from '../middleware/Auth.js';
import { createPayslip, getPayslipById, getPayslips } from '../controllers/PayslipController.js';

const payslipRoutes = Router();

payslipRoutes.post('/', protect, protectAdmin, createPayslip);
payslipRoutes.get('/', protect, getPayslips);
payslipRoutes.get('/:id', protect, getPayslipById);

export default payslipRoutes;