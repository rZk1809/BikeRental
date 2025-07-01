import express from "express";
import "dotenv/config";
import cors from "cors";
import session from "express-session";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import authRouter from "./routes/authRoutes.js";
import passport from "./configs/passport.js";

// Initialize Express App
const app = express()

// Connect Database
await connectDB()

// Middleware
app.use(cors({
    origin: [
        'https://userfrontend-ktet.onrender.com',
        'https://adminfrontend-39ew.onrender.com',
        'http://localhost:5173',
        'http://localhost:5174'
    ],
    credentials: true
}));
app.use(express.json());

// Session middleware for Passport
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-session-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // true in production with HTTPS
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res)=> res.send("Server is running"))
app.use('/api/user', userRouter)
app.use('/api/admin', adminRouter)
app.use('/api/bookings', bookingRouter)
app.use('/api/auth', authRouter)

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`))
