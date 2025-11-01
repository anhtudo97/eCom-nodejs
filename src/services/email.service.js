'use strict'

const { newOtp } = require("./otp.service");
const { getTemplateEmail } = require("./template.service");
const { NotFoundError } = require("../core/error.response");
const { replacePlaceholders } = require("../utils");
const { transporter } = require("../dbs/init.nodemailer");

const sendEmailVerification = async ({
    html = null,
    toEmail = null,
    subject = 'Xác nhận email dăng ký',
    text = 'Xác nhận'
}) => {
    // Implementation for sending email verification
    try {
        // 1. get template email
        const mailOptions = {
            from: '"SHOP DEV" <anhtudo0703@gmail.com>',
            to: toEmail,
            subject,
            text,
            html
        };

        // 2. send email
        await transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
            } else {
                console.log('Email sent successfully:', info.response);
            }
        });
    } catch (error) {
        console.error('Error in sendEmailVerification:', error);
        throw error;
    }
}

const sendEmailToken = async ({
    email = null,
    tem_id
}) => {
    // Implementation for sending email token
    try {
        // 1. generate token
        const token = await newOtp({ email });

        // 2. get template email
        const templateEmail = await getTemplateEmail({ tem_id, tem_name: 'HTML EMAIL TOKEN' });

        if (!templateEmail) {
            throw new NotFoundError('Template email not found');
        }

        // 3. send email
        sendEmailVerification({
            html: replacePlaceholders(templateEmail.tem_html, {
                verifyLink: `http://localhost:3000/verify?token=${token.otp_token}`,
            }),
            toEmail: email,
            subject: 'Xác nhận email đăng ký',
            text: 'Xác nhận'
        }).catch(error => {
            console.error('Error sending email token:', error);
        });

        return 1
    } catch (error) {
        console.error('Error in sendEmailToken:', error);
    }
}

module.exports = {
    sendEmailToken
};