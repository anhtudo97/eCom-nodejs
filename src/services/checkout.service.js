'use strict'

const { BadRequestError } = require("../core/error.response")
const { findCartById } = require("../models/repositories/cart.repo")
const { checkProductByServer } = require("../models/repositories/product.repository")
const DiscountService = require("./discount.service")

class CheckoutService {
    /*
        {
            cartId,
            userId,
            shop_order_ids: {
                shopId,
                shop_discount: [
                    {
                        shopId,
                        discountId,
                        codeId,
                    }
                ],
                item_products: [
                    {
                        price,
                        quantity,
                        productId
                    }
                ]
            }
        }
    */
    static async checkoutReview({
        cartId, userId, shop_order_ids
    }) {
        // check cartId existed
        const foundCart = await findCartById(cartId)

        if (!foundCart) {
            throw new BadRequestError("Cart does not existed!")
        }

        const checkout_order = {
            totalPrice: 0, // Tong tien hang,
            feeShip: 0, // fee van chuyen
            totalDiscount: 0, // tong tien discount giam gia
            totalCheckout: 0 // tong thanh toan
        }
        const shop_order_ids_new = []

        for (let index = 0; index < shop_order_ids.length; index++) {
            const { shopId, shop_discount = [], item_products = [] } = shop_order_ids[index];

            // check product avaiable
            const checkProductServer = await checkProductByServer(item_products)
            if (!checkProductServer[0]) {
                throw new BadRequestError("Order wrong!")
            }

            const checkoutPrice = checkProductServer.reduce((acc, product) => {
                return acc + (product.quantity * product.price)
            }, 0)

            // tong tien truoc khi xu ly
            checkout_order.totalPrice += checkoutPrice

            const itemCheckout = {
                shopId,
                shop_discount,
                priceRaw: checkoutPrice, // tien truoc khi giam gia
                priceApplyDiscount: checkoutPrice,
                item_products: checkProductServer
            }

            console.log("checkProductServer", checkProductServer)

            // neu shop_discount ton tai > 0, check xem co hop le khong
            if (shop_discount.length > 0) {
                // assumpt just have a discount
                // get amount discount
                const { totalPrice = 0, discount = 0 } = await DiscountService.getDiscountAmount({
                    codeId: shop_discount[0].codeId,
                    userId,
                    shopId,
                    products: checkProductServer
                })

                // tong cong discount giam gia
                checkout_order.totalDiscount += discount

                // neu tien giam gia > 0
                if (discount > 0) {
                    itemCheckout.priceApplyDiscount = checkoutPrice - discount
                }
            }

            // tong thanh toan cuoi cung
            checkout_order.totalCheckout += itemCheckout.priceApplyDiscount
            shop_order_ids_new.push(itemCheckout)
        }

        return {
            shop_order_ids,
            shop_order_ids_new,
            checkout_order
        }
    }
}

module.exports = CheckoutService