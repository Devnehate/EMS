import { DEPARTMENTS } from "../constants/Departments.js";
import Attendance from "../models/Attendance.js";
import Employee from "../models/Employee.js";
import LeaveApplication from "../models/LeaveApplication.js";
import Payslip from "../models/Payslip.js";


export const getDashboard = async (req, res) => {

    try {
        const session = req.session;
        if (session.role !== 'ADMIN') {
            const [totalEmployees, todayAttendance, pendingLeaves] = await Promise.all([
                Employee.countDocuments({ isDeleted: { $ne: true } }),
                Attendance.countDocuments({
                    date: {
                        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
                        $lt: new Date(new Date().setHours(23, 59, 59, 999))
                    }
                }),
                LeaveApplication.countDocuments({ status: 'PENDING', employeeId: session.userId })
            ]);
            return res.json({
                role: "ADMIN",
                totalEmployees,
                totalDepartments: DEPARTMENTS.length,
                todayAttendance,
                pendingLeaves
            })
        } else {
            const employee = await Employee.findOne({ userId: session.userId });
            if (!employee) return res.status(404).json({ message: 'Employee not found' });

            const today = new Date();
            const [currentMonthAttendance, pendingLeaves, latestPayslip] = await Promise.all([
                Attendance.countDocuments({
                    employeeId: employee._id, date: {
                        $gte: new Date(today.getFullYear(), today.getMonth(), 1),
                        $lt: new Date(today.getFullYear(), today.getMonth() + 1, 1),
                    }
                }),
                LeaveApplication.countDocuments({ employeeId: employee._id, status: 'PENDING' }),
                Payslip.findOne({ employeeId: employee._id }).sort({ createdAt: -1 }).lean()
            ]);

            return res.json({
                role: "EMPLOYEE",
                employee: { ...employee, id: employee._id.toString() },
                currentMonthAttendance,
                pendingLeaves,
                latestPayslip: latestPayslip ? { ...latestPayslip, id: latestPayslip._id.toString() } : null
            })
        }
    } catch (error) {
        console.error("Dashboard Error : ", error);
        return res.status(500).json({ message: 'Failed to fetch dashboard data' });
    }

}