import User from "../models/User.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Bike from "../models/Bike.js";
const generateToken = (userId)=>{
    const payload = { id: userId };
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' })
}
export const registerUser = async (req, res)=>{
    try {
        const {name, email, password} = req.body
        if(!name || !email || !password || password.length < 8){
            return res.json({success: false, message: 'Fill all the fields'})
        }
        const userExists = await User.findOne({email})
        if(userExists){
            return res.json({success: false, message: 'User already exists'})
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await User.create({name, email, password: hashedPassword})
        const token = generateToken(user._id.toString())
        res.json({success: true, token})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}
export const loginUser = async (req, res)=>{
    try {
        const {email, password} = req.body
        const user = await User.findOne({email})
        if(!user){
            return res.json({success: false, message: "User not found" })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.json({success: false, message: "Invalid Credentials" })
        }
        const token = generateToken(user._id.toString())
        res.json({success: true, token})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}
export const getUserData = async (req, res) =>{
    try {
        const {user} = req;
        res.json({success: true, user})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}
export const getBikes = async (req, res) =>{
    try {
        const bikes = await Bike.find({isAvailable: true})
        res.json({success: true, bikes})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}