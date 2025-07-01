import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true },
    password: {type: String, required: true },
    role: {type: String, enum: ["admin", "user"], default: 'user' },
    image: {type: String, default: ''},
    isEmailVerified: {type: Boolean, default: false},
    emailVerificationToken: {type: String},
    emailVerificationExpires: {type: Date},
    passwordResetToken: {type: String},
    passwordResetExpires: {type: Date},
    googleId: {type: String},
    authProvider: {type: String, enum: ['local', 'google'], default: 'local'}
},{timestamps: true})

const User = mongoose.model('User', userSchema)

export default User
