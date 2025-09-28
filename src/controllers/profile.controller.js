'use strict'
const { SuccessResponse } = require("../core/success.response")
const profiles = [
    {
        usr_id: 1,
        usr_name: 'admin',
        usr_avt: 'image.com/user/1'
    },
    {
        usr_id: 2,
        usr_name: 'shop',
        usr_avt: 'image.com/user/2'
    },
    {
        usr_id: 3,
        usr_name: 'customer',
        usr_avt: 'image.com/user/3'
    }
]

class ProfileController {
    // admin
    profiles = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get all profiles successfully',
            metadata: profiles
        }).send(res)
    }

    // shop
    profile = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get profile successfully',
            metadata: {
                usr_id: 2,
                usr_name: 'shop',
                usr_avt: 'image.com/user/2'
            },
        }).send(res)
    }
}

module.exports = new ProfileController()