'use strict';

const { model, Schema } = require('mongoose'); // Erase if already required
const DOCUMENT_NAME = 'otp_log';
const COLLECTION_NAME = 'otp_logs';

// Declare the Schema of the Mongo model
const otpSchema = new Schema(
    {
        otp_token: { type: String, required: true },
        otp_email: { type: String, required: true },
        otp_status: { type: String, enum: ['pending', 'active', 'block'], default: 'pending' },
        expiredAt: { type: Date, default: Date.now, expires: 300 }, // 5 minutes
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    },
);

//Export the model
module.exports = {
    otp: model(DOCUMENT_NAME, otpSchema),
}
