'use strict'

const { Types } = require('mongoose')
const { product, electronic, clothing, furniture } = require('../../models/product.model')

const findAllDraftForShop = async ({ query, limit, skip }) => {
    return await queryProduct({ query, limit, skip })
}

const findAllPublishedForShop = async ({ query, limit, skip }) => {
    return await queryProduct({ query, limit, skip })
}

const queryProduct = async ({ query, limit, skip }) => {
    return await product.find(query)
        .populate('product_shop', 'name email -_id')
        .sort({ updateAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec()
}

const publishProductByShop = async ({ product_shop, product_id }) => {
    const shop = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)
    })

    if (!shop) return null

    shop.isDraft = false
    shop.isPublished = true
    const { modifiedCount } = await shop.updateOne(shop)
    return modifiedCount
}

const unPublishProductByShop = async ({ product_shop, product_id }) => {
    const shop = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)
    })

    if (!shop) return null

    shop.isDraft = true
    shop.isPublished = false
    const { modifiedCount } = await shop.updateOne(shop)
    return modifiedCount
}

module.exports = {
    findAllDraftForShop,
    findAllPublishedForShop,
    publishProductByShop,
    unPublishProductByShop
}