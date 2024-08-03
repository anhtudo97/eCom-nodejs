'use strict'

const { NotFoundError } = require("../core/error.response")
const { cart } = require("../models/cart.model")
const { getProductById } = require("../models/repositories/product.repository")

/*
    Key features: Cart services
    - add product to cart [user]
    - reduce product quantity by one [user]
    - increase product quantity by one [user]
    - get cart [user]
    - delete cart [user]
    - delete cart item [user]
*/

class CartService {

    static async createUserCart({ userId, product }) {
        const query = { cart_userId: userId, cart_state: 'active' }
        const updateOrInsert = {
            $addToSet: {
                cart_products: product
            }
        }
        const options = { upsert: true, new: true }

        return await cart.findOneAndUpdate(query, updateOrInsert, options)
    }

    static async updateUserCartQuantity({ userId, product }) {
        const { productId, quantity } = product
        const query = {
            cart_userId: userId,
            'cart_products.productId': productId,
            cart_state: 'active'
        }
        const updateSet = {
            $inc: {
                'cart_products.$.quantity': quantity
            }
        }
        const options = { upsert: true, new: true }

        return await cart.findOneAndUpdate(query, updateSet, options)
    }

    static async addToCart({ userId, product = {} }) {
        // check cart ton tai hay không ?
        const userCart = await cart.findOne({ cart_userId: userId })

        if (!userCart) {
            // create cart for user


            return await CartService.createUserCart({ userId, product })
        }

        // neu co gio hang roi nhung cua co san pham 
        if (!userCart.cart_products.length) {
            userCart.cart_products = [product]
            return await userCart.save()
        }

        // gio hang ton tai va có sản phẩm này thì update quantity
        return await CartService.updateUserCartQuantity({ userId, product })
    }

    /*
        update cart v2

        shop_order_ids: [
            {
                shopId,
                item_products: [
                    {
                        quantity,
                        price,
                        shopId,
                        old_quantity,
                        productId
                    }
                ],
                version: 
            }
        
        ]
    */

    static async addToCartV2({ userId, shop_order_ids = {} }) {
        const { productId, quantity, old_quantity } = shop_order_ids[0]?.item_products[0]

        // check product
        const foundProduct = await getProductById(productId)
        if (!foundProduct) {
            throw new NotFoundError('')
        }

        // compare
        if (foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId) {
            throw new NotFoundError('Product dont belong to the shop')
        }

        if (quantity === 0) {
            // delete
        }

        return await CartService.updateUserCartQuantity({
            userId,
            product: {
                productId,
                quantity: quantity - old_quantity
            }
        })

    }

    static async deleteUserCartItem({ userId, productId }) {
        const query = { cart_userId: userId, cart_state: 'active' }
        const updateset = {
            $pull: {
                cart_products: {
                    productId
                }
            }
        }

        const deleteCart = await cart.updateOne(query, updateset)
        return deleteCart
    }

    static async getListUserCart({ userId }) {
        return await cart.findOne({
            cart_userId: +userId
        }).lean()
    }
}

module.exports = CartService;