'use strict';

const { SuccessResponse } = require("../core/success.response");
const CheckoutService = require("../services/checkout.service");

class CheckoutController {
    checkoutReview = async (req, res, next) => {
        console.log(req.user)
        new SuccessResponse({
            message: 'Create new Cart successfully',
            metadata: await CheckoutService.checkoutReview(
                req.body
            )
        }).send(res);
    }

}


module.exports = new CheckoutController()