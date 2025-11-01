'use strict';

const { ErrorResponse } = require("../core/error.response");
const { user } = require("../models/user.model");
const { sendEmailToken } = require("./email.service");

const newUserService = async ({
    email = null,
    capcha = null,
    tem_id
}) => {
    // Implementation for creating a new user
    // 1. chech email exists in dbs
    const userExist = await user.findOne({ usr_email: email }).lean();

    // 2. if email exists, throw error
    if (userExist) {
        return ErrorResponse({
            message: 'Email already exists',
        })
    }

    // 3. send token via email user
    const result = await sendEmailToken({ email, tem_id });

    return {
        message: 'User created successfully',
        metadata: {
            token: result
        }
    }
}

const checkRegisterEmailToken = async ({
    email = null,
    token = null
}) => {
    // Implementation for checking user token via email
}

module.exports = {
    newUserService,
    checkRegisterEmailToken
};