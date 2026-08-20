import express from 'express';
import cors from 'cors';
import "dotenv/config";
import multer from 'multer';
import connectDB from './config/db.js';
import authRouter from './routes/AuthRoutes.js';
import employeeRouter from './routes/EmployeeRoutes.js';
import profileRouter from './routes/ProfileRoutes.js';
import attendanceRoutes from './routes/AttendanceRoutes.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(multer().none());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use("/api/auth", authRouter);
app.use("/api/employees", employeeRouter);
app.use("/api/profile", profileRouter);
app.use("/api/attendance", attendanceRoutes);

await connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
