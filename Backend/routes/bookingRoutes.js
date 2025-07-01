import express from "express";
import {
    changeBookingStatus,
    checkAvailabilityOfBike,
    createBooking,
    getAdminBookings,
    getUserBookings,
    verifyPaymentAndUpdateBooking,
    getBookingBySessionId
} from "../controllers/bookingController.js";
import { protect } from "../middleware/auth.js";
const bookingRouter = express.Router();
bookingRouter.post('/check-availability', checkAvailabilityOfBike)
bookingRouter.post('/create', protect, createBooking)
bookingRouter.get('/user', protect, getUserBookings)
bookingRouter.get('/admin', protect, getAdminBookings)
bookingRouter.post('/change-status', protect, changeBookingStatus)
bookingRouter.post('/verify-payment', protect, verifyPaymentAndUpdateBooking)
bookingRouter.get('/session/:sessionId', protect, getBookingBySessionId)
bookingRouter.get('/test-stripe', async (req, res) => {
    try {
        const { createCheckoutSession } = await import('../services/stripeService.js');
        const testData = {
            bikeDetails: {
                bikeId: 'test',
                brand: 'Test',
                model: 'Bike',
                image: 'https://example.com/test.jpg'
            },
            userDetails: {
                userId: 'test',
                email: 'test@example.com'
            },
            bookingDetails: {
                bookingId: 'test',
                pickupDate: '2025-07-01',
                returnDate: '2025-07-03'
            },
            amount: 100
        };
        const result = await createCheckoutSession(testData);
        res.json({ success: true, result });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
});
export default bookingRouter;