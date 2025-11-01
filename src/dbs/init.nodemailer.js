'use strict'

const nodemailer = require('nodemailer');

// const transporter = nodemailer.createTransport({
//     host: 'email-smtp.ap-southeast-1.amazonaws.com',
//     port: 465,
//     secure: true, // true for 465, false for other ports
//     auth: {
//         user: 'AKIA4SW7WGZBCLIDGPGC',
//         pass: 'BK9TllDhe+6nBtD27dpJSAM+gTTL+vJ2imrVS+0qfLYk' // generated app password
//     }
// });

const transporter = nodemailer.createTransport({
    // host: 'email-smtp.ap-southeast-1.amazonaws.com',
    // port: 465,
    // secure: true, // true for 465, false for other ports
    service: 'gmail',
    auth: {
        user: 'anhtudo0703@gmail.com',
        pass: 'trcy cxpo hkwn nvcb' // generated app password
    }
});

module.exports = {
    transporter
};