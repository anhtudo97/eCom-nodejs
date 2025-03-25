"use strict";

// Require the cloudinary library
const cloudinary = require('cloudinary').v2;

// Return "https" URLs by setting secure: true
cloudinary.config({

    cloud_name: 'dr6dvtmxv',
    api_key: '357867119592425',
    api_secret: 'Rz0aVvd8Av1CSr2nIpfQchUtnCk',
    secure: true
});

// Log the configuration
module.exports = cloudinary