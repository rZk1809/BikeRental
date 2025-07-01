import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next)=>{
    const token = req.headers.authorization;
    console.log('Auth token received:', token ? 'Token present' : 'No token');

    if(!token){
        return res.json({success: false, message: "not authorized"})
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        console.log('Decoded token:', decoded);

        // Handle both formats: {id: userId} and just userId
        const userId = typeof decoded === 'object' ? decoded.id : decoded;
        console.log('User ID from token:', userId);

        if(!userId){
            console.log('No user ID found in token');
            return res.json({success: false, message: "not authorized"})
        }

        req.user = await User.findById(userId).select("-password")
        console.log('User found:', req.user ? `${req.user.email} (${req.user.role})` : 'No user found');

        if(!req.user){
            return res.json({success: false, message: "not authorized"})
        }

        next();
    } catch (error) {
        console.error('Auth error:', error.message);
        return res.json({success: false, message: "not authorized"})
    }
}
