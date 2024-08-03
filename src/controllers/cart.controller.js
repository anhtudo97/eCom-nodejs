'use strict';

const { SuccessResponse } = require("../core/success.response");
const CartService = require("../services/cart.service");

class CartController {
    addToCart = async (req, res, next) => {
        // new 
        new SuccessResponse({
            message: "Create new Cart success",
            metadata: await CartService.addToCart(req.body)
        }).send(res)
    }
    // update + -
    update = async (req, res, next) => {
        // new 
        new SuccessResponse({
            message: "Update Cart success",
            metadata: await CartService.addToCartV2(req.body)
        }).send(res)
    }

    delete = async (req, res, next) => {
        // new 
        new SuccessResponse({
            message: "Cart is deleted success",
            metadata: await CartService.deleteUserCartItem(req.body)
        }).send(res)
    }

    listToCart = async (req, res, next) => {
        // new 
        new SuccessResponse({
            message: "List Cart success",
            metadata: await CartService.getListUserCart(req.body)
        }).send(res)
    }
}

module.exports = new CartController