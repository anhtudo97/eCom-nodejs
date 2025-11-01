'use strict';

const { newUserService } = require("../services/user.service");

class UserController {

    // new user
    newUser = async (req, res, next) => {
        // Implementation for creating a new user
        const response = await newUserService({
            email: req.body.email,
            capcha: req.body.capcha,
            tem_id: req.body.tem_id
        });
        res.send(response);
    }

    // check user token via email
    checkRegisterEmailToken = async () => {
        // Implementation for checking user token via email
    }
}

module.exports = new UserController();