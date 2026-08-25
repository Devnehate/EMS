import { inngest } from "../inngest/index.js";
import Employee from "../models/Employee.js";
import LeaveApplication from "../models/LeaveApplication.js";

export const createLeave = async (req, res) => {

    try {
        const session = req.session;
        const employee = await Employee.findOne({ userId: session.userId });
        if (!employee) return res.status(404).json({ message: 'Employee not found' });
        if (employee.isDeleted) return res.status(404).json({ message: 'Your account  is deacivated. You cannot apply for leave' });
        
        const { type, startDate, endDate, reason } = req.body;

        if(!type || !startDate || !endDate || !reason) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if(new Date(startDate) < today || new Date(endDate) < today) {
            return res.status(400).json({ message: 'Leave dates must be in the future' });
        }

        if(new Date(endDate) < new Date(startDate)) {
            return res.status(400).json({ message: 'End date cannot be before start date' });
        }

        const leave = await LeaveApplication.create({
            employeeId: employee._id,
            type,
            startDate,
            endDate,
            reason,
            status: 'PENDING'
        });

        await inngest.send({
            name: 'leave/pending',
            data: {
                leaveApplicationId: leave._id,
            }
        })

        res.status(201).json({ success: true, data: leave });

    } catch (error) {
        res.status(500).json({ error: 'Failed' });
    }

}

export const getLeaves = async (req, res) => {

    try {
        const session = req.session;
        const isAdmin = session.role === 'ADMIN';
        if (isAdmin) {
            const status = req.query.status;
            const where = status ? { status } : {};
            const leaves = await LeaveApplication.find(where).populate('employeeId').sort({ createdAt: -1 });
            const data = leaves.map((l) => {
                const obj = l.toObject();
                return {
                    ...obj,
                    id: obj._id.toString(),
                    employee: obj.employeeId,
                    employeeId: obj.employeeId?._id?.toString(),
                }
            })
            res.status(200).json({ data });
        }
        else {
            const employee = await Employee.findOne({ userId: session.userId }).lean();
            if (!employee) return res.status(404).json({ message: 'Employee not found' });
            const leaves = await LeaveApplication.find({ employeeId: employee._id }).sort({ createdAt: -1 });
            return res.status(200).json({ data: leaves, employeeId: employee._id.toString() });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed' });
    }

}

export const updateLeave = async (req, res) => {

    try {
        const { status } = req.body;
        if(!['PENDING', 'APPROVED', 'REJECTED'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const leave = await LeaveApplication.findByIdAndUpdate(req.params.id, { status }, { returnDocument: 'after' });
        return res.json({ success: true, data: leave });
    } catch (error) {
        res.status(500).json({ error: 'Failed' });
    }

}