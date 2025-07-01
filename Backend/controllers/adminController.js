import imagekit from "../configs/imageKit.js";
import Booking from "../models/Booking.js";
import Bike from "../models/Bike.js";
import User from "../models/User.js";
import fs from "fs";

// API to Change Role of User
export const changeRoleToAdmin = async (req, res)=>{
    try {
        const {_id} = req.user;
        await User.findByIdAndUpdate(_id, {role: "admin"})
        res.json({success: true, message: "Now you can list bikes"})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// API to List Bike
export const addBike = async (req, res)=>{
    try {
        const {_id} = req.user;
        let bike = JSON.parse(req.body.bikeData);
        const imageFile = req.file;

        // Upload Image to ImageKit
        const fileBuffer = fs.readFileSync(imageFile.path)
        const response = await imagekit.upload({
            file: fileBuffer,
            fileName: imageFile.originalname,
            folder: '/bikes'
        })

        var optimizedImageUrl = imagekit.url({
            path : response.filePath,
            transformation : [
                {width: '1280'}, 
                {quality: 'auto'}, 

            ]
        });

        const image = optimizedImageUrl;
        await Bike.create({...bike, admin: _id, image})

        res.json({success: true, message: "Bike Added"})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// API to List Admin Bikes
export const getAdminBikes = async (req, res)=>{
    try {
        const {_id} = req.user;
        const bikes = await Bike.find({admin: _id })
        res.json({success: true, bikes})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// API to Toggle Bike Availability
export const toggleBikeAvailability = async (req, res) =>{
    try {
        const {_id} = req.user;
        const {bikeId} = req.body
        const bike = await Bike.findById(bikeId)

        // Checking is bike belongs to the user
        if(bike.admin.toString() !== _id.toString()){
            return res.json({ success: false, message: "Unauthorized" });
        }

        bike.isAvailable = !bike.isAvailable;
        await bike.save()

        res.json({success: true, message: "Availability Toggled"})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// Api to delete a bike
export const deleteBike = async (req, res) =>{
    try {
        const {_id} = req.user;
        const {bikeId} = req.body
        const bike = await Bike.findById(bikeId)

        // Checking is bike belongs to the user
        if(bike.admin.toString() !== _id.toString()){
            return res.json({ success: false, message: "Unauthorized" });
        }

        bike.admin = null;
        bike.isAvailable = false;

        await bike.save()

        res.json({success: true, message: "Bike Removed"})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// API to get Dashboard Data
export const getDashboardData = async (req, res) =>{
    try {
        const { _id, role } = req.user;

        if(role !== 'admin'){
            return res.json({ success: false, message: "Unauthorized" });
        }

        const bikes = await Bike.find({admin: _id})
        const bookings = await Booking.find({ admin: _id }).populate('bike').sort({ createdAt: -1 });

        const pendingBookings = await Booking.find({admin: _id, status: "pending" })
        const completedBookings = await Booking.find({admin: _id, status: "confirmed" })

        // Calculate monthlyRevenue from bookings where status is confirmed
        const confirmedBookings = bookings.filter(booking => booking.status === 'confirmed');
        const monthlyRevenue = confirmedBookings.reduce((acc, booking) => {
            console.log(`Adding booking price: ${booking.price} (Status: ${booking.status})`);
            return acc + (booking.price || 0);
        }, 0);

        console.log(`Dashboard calculation:`, {
            totalBookings: bookings.length,
            confirmedBookings: confirmedBookings.length,
            monthlyRevenue,
            bookingPrices: bookings.map(b => ({ id: b._id, price: b.price, status: b.status }))
        });

        const dashboardData = {
            totalBikes: bikes.length,
            totalBookings: bookings.length,
            pendingBookings: pendingBookings.length,
            completedBookings: completedBookings.length,
            recentBookings: bookings.slice(0,3),
            monthlyRevenue
        }

        res.json({ success: true, dashboardData });

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// API to update user image
export const updateUserImage = async (req, res)=>{
    try {
        const { _id } = req.user;

        const imageFile = req.file;

        // Upload Image to ImageKit
        const fileBuffer = fs.readFileSync(imageFile.path)
        const response = await imagekit.upload({
            file: fileBuffer,
            fileName: imageFile.originalname,
            folder: '/users'
        })

        var optimizedImageUrl = imagekit.url({
            path : response.filePath,
            transformation : [
                {width: '400'}, 
                {quality: 'auto'}, 
                { format: 'webp' }  
            ]
        });

        const image = optimizedImageUrl;

        await User.findByIdAndUpdate(_id, {image});
        res.json({success: true, message: "Image Updated" })

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}
