import { inngest } from '../inngest/index.js';
import Attendance from '../models/Attendance.js';
import Employee from '../models/Employee.js';
export const clockInOut = async (req, res) => {

    try {
        const session = req.session;
        const employee = await Employee.findOne({ userId: session.userId });
        if (!employee) return res.status(404).json({ message: 'Employee not found' });
        if (employee.isDeleted) return res.status(404).json({ message: 'Your account  is deacivated. You cannot clock in or out' });

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const existing = await Attendance.findOne({ employeeId: employee._id, date: today });

        const now = new Date();
        if (existing) {
            const isLate = now.getHours() >= 9 && now.getMinutes() > 0;
            const attendance = await Attendance.create({
                employeeId: employee._id,
                date: today,
                checkIn: now,
                status: isLate ? "LATE" : "PRESENT",
            });

            await inngest.send({
                name: 'employee/check-out',
                data: {
                    employeeId: employee._id,
                    attendanceId: attendance._id,
                }
            })

            return res.status(200).json({ success: true, type: 'CHECK_IN', data: attendance });
        }
        else if (!existing.checkOut) {
            const checkInTime = new Date(existing.checkIn).getTime();
            const diffMs = now.getTime() - checkInTime;
            const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

            existing.checkOut = now;

            const workingHours = parseFloat(diffHours.toFixed(2));
            let dayType = 'Half Day';
            if (workingHours >= 8) {
                dayType = 'Full Day';
            }
            else if (workingHours >= 6) {
                dayType = 'Three Quarters Day';
            }
            else if (workingHours >= 4) {
                dayType = 'Half Day';
            }
            else dayType = 'Short Day';

            existing.workingHours = workingHours;
            existing.dayType = dayType;

            await existing.save();
            return res.status(200).json({ success: true, type: 'CHECK_OUT', data: existing });
        }
        else {
            return res.status(200).json({ success: true, type: 'CHECK_OUT', data: existing });
        }

    } catch (error) {
        console.error("Attendance Error : ", error);
        return res.status(500).json({ message: 'Operation failed' });
    }

}

export const getAttendance = async (req, res) => {

    try {
        const session = req.session;
        const employee = await Employee.findOne({ userId: session.userId });
        if (!employee) return res.status(404).json({ message: 'Employee not found' });

        const limit = parseInt(req.query.limit || 30);
        const history = await Attendance.find({ employeeId: employee._id }).sort({ date: -1 }).limit(limit);

        return res.json({
            data: history,
            employee: { isDeleted: employee.isDeleted }
        });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to fetch attendance' });
    }

}