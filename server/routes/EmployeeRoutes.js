import { Router } from 'express';
import { createEmployee, deleteEmployee, getEmpoloyees, updateEmployee } from '../controllers/EmployeeController.js';
import { protect, protectAdmin } from '../middleware/Auth.js';

 const employeeRouter = Router();

employeeRouter.get('/', protect, protectAdmin, getEmpoloyees);
employeeRouter.post('/', protect, protectAdmin, createEmployee);
employeeRouter.put('/:id', protect, protectAdmin, updateEmployee);
employeeRouter.delete('/:id', protect, protectAdmin, deleteEmployee);

export default employeeRouter;