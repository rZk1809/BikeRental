import Booking from "../models/Booking.js"
import Bike from "../models/Bike.js";
import { createCheckoutSession, retrieveCheckoutSession, verifyPayment } from "../services/stripeService.js";
const checkAvailability = async (bike, pickupDate, returnDate)=>{
    const bookings = await Booking.find({
        bike,
        pickupDate: {$lte: returnDate},
        returnDate: {$gte: pickupDate},
    })
    return bookings.length === 0;
}
export const checkAvailabilityOfBike = async (req, res)=>{
    try {
        const {location, pickupDate, returnDate} = req.body
        const bikes = await Bike.find({location, isAvailable: true})
        const availableBikesPromises = bikes.map(async (bike)=>{
           const isAvailable = await checkAvailability(bike._id, pickupDate, returnDate)
           return {...bike._doc, isAvailable: isAvailable}
        })
        let availableBikes = await Promise.all(availableBikesPromises);
        availableBikes = availableBikes.filter(bike => bike.isAvailable === true)
        res.json({success: true, availableBikes})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}
export const createBooking = async (req, res) => {
    try {
        const { _id } = req.user;
        const { bike, pickupDate, returnDate } = req.body;
        const isAvailable = await checkAvailability(bike, pickupDate, returnDate);
        if (!isAvailable) {
            return res.json({ success: false, message: "Bike is not available" });
        }
        const bikeData = await Bike.findById(bike);
        if (!bikeData) {
            return res.json({ success: false, message: "Bike not found" });
        }
        const picked = new Date(pickupDate);
        const returned = new Date(returnDate);
        const timeDiff = returned - picked;
const noOfDays = Math.max(1, Math.ceil(timeDiff / (1000 * 60 * 60 * 24)));
        const price = bikeData.pricePerDay * noOfDays;
        console.log('Booking calculation:', {
            bikeId: bike,
            pricePerDay: bikeData.pricePerDay,
            pickupDate,
            returnDate,
            noOfDays,
            totalPrice: price
        });
        const booking = await Booking.create({
            bike,
            admin: bikeData.admin,
            user: _id,
            pickupDate,
            returnDate,
            price,
            paymentStatus: 'pending'
        });
        const checkoutData = {
            bikeDetails: {
                bikeId: bike.toString(),
                brand: bikeData.brand,
                model: bikeData.model,
                image: bikeData.image
            },
            userDetails: {
                userId: _id.toString(),
                email: req.user.email
            },
            bookingDetails: {
                bookingId: booking._id.toString(),
                pickupDate: pickupDate.toString(),
                returnDate: returnDate.toString()
            },
            amount: price
        };
        console.log('Calling createCheckoutSession with:', checkoutData);
        const stripeSession = await createCheckoutSession(checkoutData);
        console.log('Stripe session result:', stripeSession);
        if (!stripeSession.success) {
            console.error('Stripe session creation failed:', stripeSession.error);
            await Booking.findByIdAndDelete(booking._id);
            return res.json({
                success: false,
                message: `Failed to create payment session: ${stripeSession.error || 'Unknown error'}`
            });
        }
        booking.stripeSessionId = stripeSession.sessionId;
        await booking.save();
        res.json({
            success: true,
            message: "Booking created successfully. Please complete payment.",
            booking,
            paymentUrl: stripeSession.url,
            sessionId: stripeSession.sessionId
        });
    } catch (error) {
        console.log('Error creating booking with payment:', error.message);
        res.json({ success: false, message: error.message });
    }
};
export const getUserBookings = async (req, res)=>{
    try {
        const {_id} = req.user;
        console.log('Fetching bookings for user:', _id);
        const bookings = await Booking.find({ user: _id }).populate("bike").sort({createdAt: -1})
        console.log(`Found ${bookings.length} bookings for user ${_id}`);
        const validBookings = bookings.filter((booking, index) => {
            if (!booking.bike) {
                console.log(`Booking ${index} has null bike:`, {
                    bookingId: booking._id,
                    originalBikeId: booking.bike,
                    pickupDate: booking.pickupDate,
                    status: booking.status
                });
                return false;
            }
            console.log(`Booking ${index} bike data:`, {
                bikeId: booking.bike._id,
                bikeBrand: booking.bike.brand,
                bikeModel: booking.bike.model,
                pricePerDay: booking.bike.pricePerDay
            });
            return true;
        });
        console.log(`Returning ${validBookings.length} valid bookings out of ${bookings.length} total`);
        res.json({success: true, bookings: validBookings})
    } catch (error) {
        console.log('Error fetching user bookings:', error.message);
        res.json({success: false, message: error.message})
    }
}
export const getAdminBookings = async (req, res)=>{
    try {
        if(req.user.role !== 'admin'){
            return res.json({ success: false, message: "Unauthorized" })
        }
        const bookings = await Booking.find({admin: req.user._id}).populate('bike user').select("-user.password").sort({createdAt: -1 })
        console.log(`Admin ${req.user.email} fetching ${bookings.length} bookings`);
        bookings.forEach((booking, index) => {
            console.log(`Admin Booking ${index}:`, {
                id: booking._id,
                price: booking.price,
                status: booking.status,
                bike: booking.bike ? `${booking.bike.brand} ${booking.bike.model}` : 'No bike',
                user: booking.user ? booking.user.email : 'No user'
            });
        });
        res.json({success: true, bookings})
    } catch (error) {
        console.log('Error fetching admin bookings:', error.message);
        res.json({success: false, message: error.message})
    }
}
export const changeBookingStatus = async (req, res)=>{
    try {
        const {_id} = req.user;
        const {bookingId, status} = req.body
        const booking = await Booking.findById(bookingId)
        if(booking.admin.toString() !== _id.toString()){
            return res.json({ success: false, message: "Unauthorized"})
        }
        booking.status = status;
        await booking.save();
        if (status === 'cancelled') {
            await Bike.findByIdAndUpdate(booking.bike, { isAvailable: true });
            console.log(`Bike ${booking.bike} marked as available after cancellation`);
        } else if (status === 'completed') {
            await Bike.findByIdAndUpdate(booking.bike, { isAvailable: true });
            console.log(`Bike ${booking.bike} marked as available after completion`);
        }
        res.json({ success: true, message: "Status Updated"})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}
export const verifyPaymentAndUpdateBooking = async (req, res) => {
    try {
        const { sessionId } = req.body;
        const sessionResult = await retrieveCheckoutSession(sessionId);
        if (!sessionResult.success) {
            return res.json({
                success: false,
                message: "Failed to verify payment session"
            });
        }
        const { session, paymentStatus, paymentIntentId } = sessionResult;
        const booking = await Booking.findOne({ stripeSessionId: sessionId });
        if (!booking) {
            return res.json({
                success: false,
                message: "Booking not found"
            });
        }
        if (paymentStatus === 'paid') {
            booking.paymentStatus = 'paid';
            booking.stripePaymentIntentId = paymentIntentId;
            booking.status = 'pending'; // Ready for admin approval
            await booking.save();
            await Bike.findByIdAndUpdate(booking.bike, { isAvailable: false });
            console.log(`Bike ${booking.bike} marked as unavailable after successful payment`);
            res.json({
                success: true,
                message: "Payment successful! Your booking is now pending admin approval.",
                booking
            });
        } else {
            booking.paymentStatus = 'failed';
            await booking.save();
            res.json({
                success: false,
                message: "Payment failed. Please try again.",
                booking
            });
        }
    } catch (error) {
        console.log('Error verifying payment:', error.message);
        res.json({ success: false, message: error.message });
    }
};
export const getBookingBySessionId = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const booking = await Booking.findOne({ stripeSessionId: sessionId })
            .populate('bike')
            .populate('user', '-password');
        if (!booking) {
            return res.json({
                success: false,
                message: "Booking not found"
            });
        }
        res.json({
            success: true,
            booking
        });
    } catch (error) {
        console.log('Error getting booking by session ID:', error.message);
        res.json({ success: false, message: error.message });
    }
};