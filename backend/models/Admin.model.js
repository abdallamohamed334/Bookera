// models/Admin.model.js
import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "admin",
    enum: ["admin", "superadmin"],
  },
  permissions: [{
    type: String,
    enum: ["users", "bookings", "venues", "reports", "settings"]
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
  lastLogin: {
    type: Date,
  }
}, { 
  timestamps: true 
});

export const Admin = mongoose.model("Admin", adminSchema);