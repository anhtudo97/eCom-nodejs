'use strict'

const { cart } = require("../models/cart.model")

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
            userCart.cart_count_product = [product]
            return await userCart.save()
        }

        // gio hang ton tai va có sản phẩm này thì update quantity
        return await CartService.updateUserCartQuantity({ userId, product })
    }
}