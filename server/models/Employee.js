import mongoose from "mongoose";
import { DEPARTMENTS } from "../constants/Departments.js";

const employeeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    position: {
      type: String,
      required: true,
      trim: true,
    },

    department: {
      type: String,
      enum: DEPARTMENTS,
      default: "Engineering",
    },

    basicSalary: {
      type: Number,
      default: 0,
    },

    allowance: {
      type: Number,
      default: 0,
    },

    deduction: {
      type: Number,
      default: 0,
    },

    employeeStatus: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },

    joinDate: {
      type: Date,
      required: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    bio: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Employee =
  mongoose.models.Employee ||
  mongoose.model("Employee", employeeSchema);

export default Employee;