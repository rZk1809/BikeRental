import mongoose from "mongoose";
const connectDB = async ()=>{
    try {
        mongoose.connection.on('connected', ()=> console.log("Database Connected"));
        const mongoUri = process.env.MONGODB_URI.includes('/bike-rental')
            ? process.env.MONGODB_URI
            : `${process.env.MONGODB_URI}/bike-rental`;
        await mongoose.connect(mongoUri)
    } catch (error) {
        console.log(error.message);
    }
}
export default connectDB;