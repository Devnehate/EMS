import 'dotenv/config';
import connectDB from './config/db.js';
import User from './models/User.js';
import bcrypt from 'bcrypt';

const TemporaryPassword = 'Admin123';

async function registerAdmin() {
    try {
        const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

        if (!ADMIN_EMAIL) {
            console.error('ADMIN_EMAIL is not defined in the environment variables.');
            process.exit(1);
        }
        await connectDB();

        const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });
        if(existingAdmin) {
            console.log('Admin user already exists.', existingAdmin.role);
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash(TemporaryPassword, 10);
        const admin = await User.create({
            email: process.env.ADMIN_EMAIL,
            password: hashedPassword,
            role: 'ADMIN'
        });
        console.log('Admin user registered successfully.');
        console.log('\nemail : ', admin.email);
        console.log('password : ',TemporaryPassword);
        console.log('\nChange the password after login');
        
    } catch (error) {
        console.error('Seed failed:', error);
    }
}

registerAdmin();