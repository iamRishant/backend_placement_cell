import crypto from "crypto";
import { Otp } from "../models/otp.model.js";
import { sendOtpEmail } from "../middlewares/mailer.middleware.js";
const OTP_LENGTH = 6;
const OTP_TTL_MS  = 5 * 60 * 1000;  // 5 minutes
const MAX_ATTEMPTS = 5;

function genCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
function hashCode(code) {

  return crypto.createHash('sha256').update(code).digest('hex');
}

const sendOtp = async (req, res) => {
    const { email } = req.body;
    if (!email || !email.endsWith('@cuchd.in')) {
        return res.status(400).json({ error: 'Only @cuchd.in allowed' });
    }

    const code     = genCode();
    const codeHash = hashCode(code);
    const expires  = new Date(Date.now() + OTP_TTL_MS);

    // Upsert the OTP document
    await Otp.findOneAndUpdate(
        { email },
        { codeHash, expiresAt: expires, attempts: 0, verified: false },
        { upsert: true, new: true }
    );

    // fire-and-forget or await
    await sendOtpEmail(email, code);

    res.json({ success: true, message: 'OTP sent to email' });
}

const verifyOtp = async (req, res) => {
    const { email, code } = req.body;
    if (!email || !code) {
        return res.status(400).json({ error: 'Email and code required' });
    }

    const otpEntry = await Otp.findOne({ email });
    if (!otpEntry) {
        return res.status(400).json({ error: 'No OTP found or expired' });
    }

    // optional brute-force guard
    if (otpEntry.attempts >= MAX_ATTEMPTS) {
        await Otp.deleteOne({ email });
        return res.status(429).json({ error: 'Too many attempts, try again' });
    }

    // check expiry
    if (otpEntry.expiresAt < new Date()) {
        await Otp.deleteOne({ email });
        return res.status(400).json({ error: 'OTP expired' });
    }

    // validate code
    if (hashCode(code) !== otpEntry.codeHash) {
        otpEntry.attempts++;
        await otpEntry.save();
        return res.status(400).json({ error: 'Invalid code' });
    }
    // mark as verified
    otpEntry.verified = true;
    await otpEntry.save();
    
    return res.json({ success: true, message: 'Email verified' });
}
export { sendOtp, verifyOtp };