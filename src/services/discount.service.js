'use strict'

const { BadRequestError, NotFoundError } = require("../core/error.response")
const discountModel = require("../models/discount.model")
const { checkDiscountExist, findAllDiscountCodesUnSelect, findAllDiscountCodesSelect } = require("../models/repositories/discount.repo")
const { findAllProducts } = require("../models/repositories/product.repository")
const { convertToObjectMongodb } = require("../utils")

/**
 * Discount service
 * 1 - Generator Discount Code [Shop | Admin]
 * 2 - Get discount amount [User]
 * 3 - Get all discount codes [User | Shop]
 * 4 - Verify discount code [User]
 * 5 - Delete discount Code [Admin | Shop]
 * 6 - Cancel discount code [User]
*/

class DiscountService {
    static async createDiscountCode(body) {
        const {
            code,
            start_date,
            end_date,
            is_active,
            shopId,
            min_order_value,
            product_ids,
            applies_to,
            name,
            description,
            type,
            value,
            max_value,
            max_uses,
            uses_count,
            users_used,
            max_uses_per_user
        } = body

        // tracking
        // if (new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
        //     throw new BadRequestError("Discount code has expired!")
        // }

        if (new Date(start_date) >= new Date(end_date)) {
            throw new BadRequestError("Start date must be below than end date")
        }

        // crete index for discount code
        const foundDiscount = await discountModel.findOne({
            discount_code: code,
            discount_shopId: convertToObjectMongodb(shopId)
        }).lean()

        if (foundDiscount && foundDiscount.discount_is_active) {
            throw new BadRequestError("Discount existed!")
        }

        const newDiscount = await discountModel.create({
            discount_name: name,
            discount_description: description,
            discount_type: type, // percentage
            discount_value: value, // 10,000
            discount_code: code, // discount code
            discount_max_value: max_value, // 10,000

            discount_start_date: new Date(start_date),
            discount_end_date: new Date(end_date),
            discount_max_uses: max_uses, // so luong discount được áp dụng
            discount_uses_count: uses_count, // số discount đã sử dụng
            discount_users_used: users_used,  // ai đã sử dụng
            discount_max_uses_per_user: max_uses_per_user, // số lượng tối đã 1 user có thể sử dụng
            discount_min_order_value: min_order_value || 0,
            discount_shopId: shopId,

            discount_is_active: is_active,
            discount_applies_to: applies_to,
            discount_product_ids: applies_to === 'all' ? [] : product_ids
        })

        return newDiscount
    }

    static async updateDiscountCode() {
        ///.....
    }

    /*
        Get all discount codes available with product
    */

    static async getAllDiscountCodesWithProduct({
        code, shopId, userId, limit, page
    }) {
        // create index for discount code
        const foundDiscount = await discountModel.findOne({
            discount_code: code,
            discount_shopId: convertToObjectMongodb(shopId)
        }).lean()

        if (!foundDiscount || !foundDiscount.discount_is_active) {
            throw new NotFoundError("Discount not exist!")
        }

        const { discount_applies_to, discount_product_ids } = foundDiscount
        let products

        if (discount_applies_to === 'all') {
            console.log(convertToObjectMongodb(shopId))
            products = await findAllProducts({
                filter: {
                    product_shop: convertToObjectMongodb(shopId),
                    isPublished: true
                },
                limit: +limit,
                page: +page,
                sort: 'ctime', // sort theo thoi gian gần đây nhất
                select: ['product_name']
            })
        }

        if (discount_applies_to === 'specific') {
            products = await findAllProducts({
                filter: {
                    _id: {
                        $in: discount_product_ids
                    },
                    isPublished: true
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            })
        }

        return products
    }

    /*
       Get all discount codes by shop
   */

    static async getAllDiscountCodesByShop({
        limit, page, shopId
    }) {
        const discounts = await findAllDiscountCodesSelect({
            limit: +limit,
            page: +page,
            filter: {
                discount_shopId: convertToObjectMongodb(shopId),
                discount_is_active: true
            },
            select: ['discount_name', 'discount_code'],
            model: discountModel
        })

        return discounts
    }

    /*
       Apply discount code
       products = [
        {
            productId,
            shopId,
            quantity,
            name,
            price
        },
        {
            productId,
            shopId,
            quantity,
            name,
            price
        },
       ]
   */

    static async getDiscountAmount({
        codeId, userId, shopId, products
    }) {
        const foundDiscount = await checkDiscountExist({
            model: discountModel,
            filter: {
                discount_code: codeId,
                discount_shopId: convertToObjectMongodb(shopId)
            }
        })

        if (!foundDiscount) {
            throw new NotFoundError("Discount not  existed!")
        }

        const { discount_is_active, discount_max_uses, discount_start_date, discount_end_date, discount_min_order_value, discount_users_used, discount_max_uses_per_user, discount_type, discount_value } = foundDiscount
        console.log(foundDiscount)
        if (!discount_is_active) throw new NotFoundError("Discount is expired!")

        if (!discount_max_uses) throw new NotFoundError("Discount are out!")

        // if (new Date() < new Date(discount_start_date) || new Date() > new Date(discount_end_date)) {
        //     throw new NotFoundError("Discount is expired!")
        // }

        // check xem có xét giá trị tối thiểu cho discount code không 
        let totalOrder = 0
        if (discount_min_order_value > 0) {
            // get total 
            totalOrder = products.reduce((acc, product) => {
                return acc + (product.quantity * product.price)
            }, 0)

            if (totalOrder > discount_min_order_value) {
                throw new NotFoundError(`Discount requires a minimum order value of ${discount_min_order_value}`)
            }
        }

        if (discount_max_uses_per_user > 0) {
            const userUsesDiscount = discount_users_used.find(user => user.userId === userId)
            if (userUsesDiscount) {

            }
        }

        // check discount là fixed amount hay là percentage
        const amount = discount_type === 'fixed-amount' ? discount_value : totalOrder * (discount_value / 100)

        return {
            totalOrder, discount: amount, totalPrice: totalOrder - amount
        }
    }

    /*
        Delete a dicount code
    */

    static async deleteDiscountCode({ shopId, codeId }) {
        // check is exist discout code before delete

        const deleted = await discountModel.findByIdAndDelete({
            discount_code: codeId,
            discount_shopId: convertToObjectMongodb(shopId)
        })

        return deleted
    }

    /*
        Cancel a discount if that discount is not valid
    */

    static async cancelDiscountCode({ shopId, codeId, userId }) {
        const foundDiscount = checkDiscountExist({
            model: discountModel,
            filter: {
                discount_code: codeId,
                discount_shopId: convertToObjectMongodb(shopId)
            }
        })

        if (!foundDiscount) {
            throw new NotFoundError("Discount not  existed!")
        }

        const result = await discountModel.findByIdAndUpdate(foundDiscount._id, {
            $pull: {
                discount_users_used: userId
            },
            $inc: {
                discount_max_uses: 1,
                discount_uses_count: -1
            }
        })

        return result
    }
}

module.exports = DiscountService