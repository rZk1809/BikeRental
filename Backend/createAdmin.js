import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import User from "./models/User.js";
import "dotenv/config";

const createAdminUser = async () => {
    try {
        // Connect to database
        await mongoose.connect(`${process.env.MONGODB_URI}/bike-rental`);
        console.log("Connected to database");

        // Admin user details
        const adminData = {
            name: "Admin User",
            email: "admin@bikerental.com",
            password: "admin123456",
            role: "admin"
        };

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: adminData.email });
        if (existingAdmin) {
            console.log("Admin user already exists!");
            console.log("Email:", adminData.email);
            console.log("Password: admin123456");
            process.exit(0);
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(adminData.password, 10);

        // Create admin user
        const adminUser = await User.create({
            name: adminData.name,
            email: adminData.email,
            password: hashedPassword,
            role: adminData.role
        });

        console.log("✅ Admin user created successfully!");
        console.log("📧 Email:", adminData.email);
        console.log("🔑 Password:", adminData.password);
        console.log("👤 User ID:", adminUser._id);
        console.log("\nYou can now login to the admin panel with these credentials.");

    } catch (error) {
        console.error("❌ Error creating admin user:", error.message);
    } finally {
        mongoose.connection.close();
        process.exit(0);
    }
};

createAdminUser();
