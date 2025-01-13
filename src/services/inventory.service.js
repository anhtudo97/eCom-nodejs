'use strict'

const { BadRequestError } = require("../core/error.response")
const { inventory } = require("../models/inventory.model")
const { getProductById } = require("../models/repositories/product.repository")

class InventoryService {
    static async addStockToInventory({
        stock,
        productId,
        shopId,
        location = '18 ward, Doi Can, Tuyen Quang city'
    }) {
        const product = await getProductById(productId)
        if (!product) {
            throw new BadRequestError("Product is not exited!")
        }

        const query = {
            inven_shopId: shopId,
            inven_productId: productId
        }
        const updateSet = {
            $inc: {
                inven_stock: stock
            },
            $set: {
                inven_location: location
            }
        }
        const options = {
            upsert: true,
            new: true
        }

        return await inventory.findOneAndUpdate(query, updateSet, options)
    }
}

module.exports = InventoryService