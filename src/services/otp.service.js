'use strict';

const { randomInt } = require("crypto");
const { otp } = require("../models/otp.model");

const generateOTP = async () => {
    // Implementation for generating an OTP
    const token = randomInt(100000, 999999); // Generate 6-digit OTP
    return token;
}

const newOtp = async ({ email = null }) => {
    // Implementation for creating a new OTP
    const token = await generateOTP();
    const newToken = await otp.create({
        otp_token: token,
        otp_email: email,
    });
    return newToken;
}

module.exports = {
    generateOTP,
    newOtp
};