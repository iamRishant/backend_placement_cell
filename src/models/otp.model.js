import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    email: {
        type: String, 
        required: true,
        index: true
    },
    codeHash: {
        type: String, 
        required: true
    },
    expiresAt: {
        type: Date, 
        required: true,
        index: { expires: 0 } // Automatically remove the document after the specified time
    },
    attempts: {
        type: Number, 
        default: 0
    },
    verified: {
        type: Boolean, 
        default: false
    }
}, { timestamps: true });

export const Otp = mongoose.model("Otp", otpSchema);



