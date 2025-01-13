'use strict'

const { Types } = require('mongoose')
const { product, electronic, clothing, furniture } = require('../../models/product.model')
const { getSelectData, unGetSelectData, convertToObjectIdMongodb } = require('../../utils')

const findAllDraftForShop = async ({ query, limit, skip }) => {
    return await queryProduct({ query, limit, skip })
}

const findAllPublishedForShop = async ({ query, limit, skip }) => {
    return await queryProduct({ query, limit, skip })
}


const searchProductByUser = async ({ searchKey }) => {
    const regexSearch = new RegExp(searchKey)
    return await product.find({
        isPublished: true,
        $text: {
            $search: regexSearch,
        },

    }, {
        score: {
            $meta: 'textScore'
        }
    }).sort({
        score: {
            $meta: 'textScore'
        }
    }).lean()
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

const findAllProducts = async ({ limit, sort, page, filter, select }) => {
    const skip = (page - 1) * limit
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
    const products = await product.find(filter).sort(sortBy).skip(skip).limit(limit).select(getSelectData(select)).lean()
    return products
}

const findProduct = async ({ product_id, unSelect }) => {
    return await product.findById(product_id).select(unGetSelectData(unSelect))
}

const updateProductById = async ({ product_id, payload, model, isNew = true }) => {
    return await model.findByIdAndUpdate(product_id, payload, {
        new: isNew
    })
}

const getProductById = async (productId) => {
    return await product.findOne({
        _id: convertToObjectIdMongodb(productId)
    }).lean()
}

const checkProductByServer = async products => {
    return await Promise.all(products.map(async product => {
        const foundProduct = await getProductById(product.productId)
        console.log("foundProduct", product, )
        if (foundProduct) {
            return {
                price: foundProduct.product_price,
                quantity: product.quantity,
                productId: product.productId
            }
        }
        // return null
    }))
}

module.exports = {
    findAllDraftForShop,
    findAllPublishedForShop,
    publishProductByShop,
    unPublishProductByShop,
    searchProductByUser,
    findAllProducts,
    findProduct,
    updateProductById,
    getProductById,
    checkProductByServer
}