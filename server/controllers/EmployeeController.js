import Employee from "../models/Employee.js";
import bcrypt from "bcrypt";
import User from "../models/User.js";

export const getEmpoloyees = async (req, res) => {
    try {
        const { department } = req.query;

        const where = {
            isDeleted: { $ne: true },
        };

        if (department) {
            where.department = department;
        }

        const employees = await Employee.find(where)
            .sort({ createdAt: -1 })
            .populate("userId", "email role")
            .lean();

        const result = employees.map((emp) => ({
            ...emp,
            id: emp._id.toString(),
            user: emp.userId
                ? {
                    email: emp.userId.email,
                    role: emp.userId.role,
                }
                : null,
        }));

        return res.json(result);
    } catch (error) {
        console.error("Get employees error:", error);

        return res.status(500).json({
            message: "Failed to fetch employees",
        });
    }
};

export const createEmployee = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            phone,
            position,
            department,
            basicSalary,
            allowance,
            deduction,
            joinDate,
            password,
            role,
            bio,
        } = req.body;

        if (!email || !password || !firstName || !lastName) {
            return res.status(400).json({
                message: "Missing required fields",
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "Email already exists",
            });
        }

        const hashed = await bcrypt.hash(password, 10);

        const user = await User.create({
            email,
            password: hashed,
            role: role || "EMPLOYEE",
        });

        try {
            const employee = await Employee.create({
                userId: user._id,
                firstName,
                lastName,
                email,
                phone,
                position,
                department: department || "Engineering",
                basicSalary: Number(basicSalary) || 0,
                allowance: Number(allowance) || 0,
                deduction: Number(deduction) || 0,
                joinDate: new Date(joinDate),
                bio: bio || "",
            });

            return res.status(201).json({
                success: true,
                message: "Employee created successfully",
                employee,
            });
        } catch (employeeError) {
            // Remove created user if employee creation fails
            await User.findByIdAndDelete(user._id);

            throw employeeError;
        }
    } catch (error) {
        console.error("Create employee error:", error);

        if (error.code === 11000) {
            return res.status(400).json({
                message: "Email or employee already exists",
            });
        }

        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: Object.values(error.errors)
                    .map((err) => err.message)
                    .join(", "),
            });
        }

        return res.status(500).json({
            message: "Failed to create employee",
        });
    }
};

export const updateEmployee = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            firstName,
            lastName,
            email,
            phone,
            position,
            department,
            basicSalary,
            allowance,
            deduction,
            password,
            role,
            bio,
            employeeStatus,
        } = req.body;

        const employee = await Employee.findById(id);

        if (!employee) {
            return res.status(404).json({
                message: "Employee not found",
            });
        }

        const updatedEmployee = await Employee.findByIdAndUpdate(
            id,
            {
                firstName,
                lastName,
                email,
                phone,
                position,
                department: department || "Engineering",
                basicSalary: Number(basicSalary) || 0,
                allowance: Number(allowance) || 0,
                deduction: Number(deduction) || 0,
                employeeStatus: employeeStatus || "ACTIVE",
                bio: bio || "",
            },
            {
                new: true,
                runValidators: true,
            }
        );

        const userUpdate = {
            email,
        };

        if (role) {
            userUpdate.role = role;
        }

        if (password) {
            userUpdate.password = await bcrypt.hash(password, 10);
        }

        await User.findByIdAndUpdate(
            employee.userId,
            userUpdate,
            {
                new: true,
                runValidators: true,
            }
        );

        return res.status(200).json({
            success: true,
            message: "Employee updated successfully",
            employee: updatedEmployee,
        });
    } catch (error) {
        console.error("Update employee error:", error);

        if (error.code === 11000) {
            return res.status(400).json({
                message: "Email already exists",
            });
        }

        return res.status(500).json({
            message: "Failed to update employee",
        });
    }
};

export const deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;

        const employee = await Employee.findById(id);

        if (!employee) {
            return res.status(404).json({
                message: "Employee not found",
            });
        }

        employee.isDeleted = true;
        employee.employeeStatus = "INACTIVE";

        await employee.save();

        return res.status(200).json({
            success: true,
            message: "Employee deleted successfully",
        });
    } catch (error) {
        console.error("Delete employee error:", error);

        return res.status(500).json({
            message: "Failed to delete employee",
        });
    }
};