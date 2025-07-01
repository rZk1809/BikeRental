import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Test Stripe connection
console.log('Stripe initialized with key:', process.env.STRIPE_SECRET_KEY ? 'Key present' : 'Key missing');

// Create payment intent for booking
export const createPaymentIntent = async (amount, currency = 'usd', metadata = {}) => {
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Convert to cents
            currency,
            metadata,
            automatic_payment_methods: {
                enabled: true,
            },
        });

        return {
            success: true,
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id
        };
    } catch (error) {
        console.error('Error creating payment intent:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

// Create checkout session for booking
export const createCheckoutSession = async (bookingData) => {
    try {
        const { bikeDetails, userDetails, bookingDetails, amount } = bookingData;

        console.log('Creating Stripe checkout session with data:', {
            bikeDetails,
            userDetails: { ...userDetails, email: userDetails.email },
            bookingDetails,
            amount
        });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: `Bike Rental - ${bikeDetails.brand} ${bikeDetails.model}`,
                            description: `Rental from ${bookingDetails.pickupDate} to ${bookingDetails.returnDate}`,
                            images: bikeDetails.image ? [bikeDetails.image] : [],
                        },
                        unit_amount: Math.round(amount * 100), // Convert to cents
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/booking-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/booking-cancelled`,
            customer_email: userDetails.email,
            metadata: {
                bookingId: String(bookingDetails.bookingId),
                userId: String(userDetails.userId),
                bikeId: String(bikeDetails.bikeId),
                pickupDate: String(bookingDetails.pickupDate),
                returnDate: String(bookingDetails.returnDate),
            },
        });

        return {
            success: true,
            sessionId: session.id,
            url: session.url
        };
    } catch (error) {
        console.error('Error creating checkout session:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

// Verify payment status
export const verifyPayment = async (paymentIntentId) => {
    try {
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        
        return {
            success: true,
            status: paymentIntent.status,
            amount: paymentIntent.amount / 100, // Convert back from cents
            currency: paymentIntent.currency
        };
    } catch (error) {
        console.error('Error verifying payment:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

// Retrieve checkout session
export const retrieveCheckoutSession = async (sessionId) => {
    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        
        return {
            success: true,
            session,
            paymentStatus: session.payment_status,
            paymentIntentId: session.payment_intent
        };
    } catch (error) {
        console.error('Error retrieving checkout session:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

// Create refund
export const createRefund = async (paymentIntentId, amount = null) => {
    try {
        const refundData = {
            payment_intent: paymentIntentId,
        };
        
        if (amount) {
            refundData.amount = Math.round(amount * 100); // Convert to cents
        }

        const refund = await stripe.refunds.create(refundData);

        return {
            success: true,
            refundId: refund.id,
            status: refund.status,
            amount: refund.amount / 100 // Convert back from cents
        };
    } catch (error) {
        console.error('Error creating refund:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

export default stripe;
