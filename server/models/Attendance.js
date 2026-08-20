import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    checkIn: {
        type: Date,
        defult: null
    },
    checkOut: {
        type: Date,
        defult: null
    },
    status: {
        type: String,
        enum: ['PRESENT', 'ABSENT', 'LEAVE'],
        default: 'ABSENT'
    },
    workingHours: {
        type: Number,
        default: 0
    },
    dayType: {
        type: String,
        enum: ['Full Day','Three Quarters Day','Half Day','Short Day',null],
        default: null
    }
}, { timestamps: true });

attendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);
export default Attendance;