'use strict';

const { SuccessResponse } = require("../core/success.response");
const DiscountService = require("../services/discount.service");

class DiscountController {
    createDiscountCode = async (req, res, next) => {
        console.log(req.user)
        new SuccessResponse({
            message: 'Successful code Generations',
            metadata: await DiscountService.createDiscountCode({
                ...req.body,
                shopId: req.user.userId
            })
        }).send(res);
    }

    getAllDiscountCode = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get all code successful',
            metadata: await DiscountService.getAllDiscountCodesByShop({
                ...req.query,
                shopId: req.user.userId
            })
        }).send(res);
    }

    getAllDiscountAmount = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get all code successful',
            metadata: await DiscountService.getDiscountAmount({
                ...req.body,
            })
        }).send(res);
    }

    getAllDiscountCodesWithProducts = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get all discount code with products successful',
            metadata: await DiscountService.getAllDiscountCodesWithProduct({
                ...req.query,
            })
        }).send(res);
    }
}


module.exports = new DiscountController()