import mongoose from "mongoose";
const {ObjectId} = mongoose.Schema.Types
const bookingSchema = new mongoose.Schema({
    bike: {type: ObjectId, ref: "Bike", required: true},
    user: {type: ObjectId, ref: "User", required: true},
    admin: {type: ObjectId, ref: "User", required: true},
    pickupDate: {type: Date, required: true},
    returnDate: {type: Date, required: true},
    status: {type: String, enum: ["pending", "confirmed", "completed", "cancelled"], default: "pending"},
    price: {type: Number, required: true},
    paymentStatus: {type: String, enum: ["pending", "paid", "failed", "refunded"], default: "pending"},
    stripePaymentIntentId: {type: String},
    stripeSessionId: {type: String},
    paymentMethod: {type: String, default: "stripe"}
},{timestamps: true})
const Booking = mongoose.model('Booking', bookingSchema)
export default Booking