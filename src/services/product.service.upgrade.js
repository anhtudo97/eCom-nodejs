'use strict';

const { clothing, electronic, product, furniture } = require('../models/product.model');
const { BadRequestError } = require('../core/error.response');
const { findAllDraftForShop, publishProductByShop, findAllPublishedForShop, unPublishProductByShop, searchProductByUser, findAllProducts, findProduct, updateProductById } = require('../models/repositories/product.repository');
const { Types } = require('mongoose');
const { updateNestedObjectParser, removeUndefinedObject } = require('../utils');
const { insertInventory } = require('../models/repositories/inventory.repo');
// define factory class to create product
class ProductFactory {
    /*
        type: Clothing
        payload
    */
    static productRegistry = {}

    static registerProductType(type, classRef) {
        ProductFactory.productRegistry[type] = classRef
    }

    static async createProduct(type, payload) {
        const productClass = ProductFactory.productRegistry[type]
        if (!productClass) throw new BadRequestError(`Invalid Product types ${type}`)

        return new productClass(payload).createProduct()
    }

    static async updateProduct(type, product_id, payload) {
        console.log('[4444] ::: ', type)
        const productClass = ProductFactory.productRegistry[type]
        if (!productClass) throw new BadRequestError(`Invalid Product types ${type}`)

        console.log('[5555] ::: ', productClass)
        // const productInstance = new productClass(payload)
        // console.log('[P22] ::: ', productInstance)
        return new productClass(payload).updateProduct(product_id, payload)
    }

    // QUERY
    static async findAllDraftForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isDraft: true }
        return await findAllDraftForShop({ query, limit, skip })
    }

    static async findAllPublishedForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isPublished: true }

        return await findAllPublishedForShop({ query, limit, skip })
    }

    static async searchProducts({ searchKey }) {
        return await searchProductByUser({ searchKey })
    }

    static async findAllProducts({ limit = 50, sort = 'ctime', page = 1, filter = { isPublished: true } }) {
        return await findAllProducts({ limit, sort, page, filter, select: ['product_name', 'product_price', 'product_thumb'] })
    }

    static async findProduct({ product_id }) {
        return await findProduct({ product_id, unSelect: ['__v'] })
    }
    // END QUERY

    // PUT
    static async publishProductByShop({ product_shop, product_id }) {
        return await publishProductByShop({ product_shop, product_id })
    }

    static async unPublishProductByShop({ product_shop, product_id }) {
        return await unPublishProductByShop({ product_shop, product_id })
    }
    // END PUT
}

// define base product class
class Product {
    constructor({ product_name,
        product_thumb,
        product_description,
        product_price,
        product_quantity,
        product_type,
        product_shop,
        product_attributes }) {
        this.product_name = product_name;
        this.product_thumb = product_thumb;
        this.product_description = product_description;
        this.product_price = product_price;
        this.product_quantity = product_quantity;
        this.product_type = product_type;
        this.product_shop = product_shop;
        this.product_attributes = product_attributes;
    }

    // create new product
    async createProduct(product_id) {
        const newProduct = await product.create({
            ...this,
            _id: product_id
        })
        console.log("new P", newProduct)

        if (newProduct) {
            // add product stock in inventory collection
            console.log("run")

            await insertInventory({
                productId: newProduct._id,
                shopId: this.product_shop,
                stock: this.product_quantity
            })
        }

        return newProduct
    }

    // update product
    async updateProduct(product_id, payload) {
        // console.log('update')
        return await updateProductById({
            product_id, payload, model: product
        })
    }
}

// define sub class for different product types Clothing
class Clothing extends Product {

    constructor({ product_name,
        product_thumb,
        product_description,
        product_price,
        product_quantity,
        product_type,
        product_shop,
        product_attributes }) {
        super({
            product_name,
            product_thumb,
            product_description,
            product_price,
            product_quantity,
            product_type,
            product_shop,
            product_attributes
        });
        console.log("[Con] Clothing")
    }

    async createProduct() {
        const newClothing = await clothing.create(this.product_attributes)
        if (!newClothing) throw new BadRequestError(`Create new Clothing error`)

        const newProduct = await super.createProduct()
        if (!newProduct) throw new BadRequestError(`Create new Product error`)

        console.log('product is created')

        return newProduct;
    }

    async updateProduct(product_id) {
        // update ở đâu và chỗ nào
        // const updateNest = updateNestedObjectParser(this);
        // remove all fields is null / undefined
        // const objectParams = await removeUndefinedObject(this)

        const updateNest = updateNestedObjectParser(this);
        const objectParams = removeUndefinedObject(updateNest);
        if (objectParams.product_attributes) {
            // update child
            await updateProductById({
                model: clothing,
                product_id,
                payload: updateNestedObjectParser(objectParams.product_attributes)
            })
        }

        const updateProduct = await super.updateProduct(product_id, updateNestedObjectParser(objectParams))
        return updateProduct
        // return updateProduct
    }
}

// define sub class for different product types Electronics
class Electronics extends Product {
    async createProduct() {
        const newElectronic = await electronic.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if (!newElectronic) throw new BadRequestError(`Create new Clothing error`)

        const newProduct = await super.createProduct(newElectronic._id)
        if (!newProduct) throw new BadRequestError(`Create new Product error`)

        return newProduct;
    }

    async updateProduct(product_id) {
        console.log('elec')
        // remove all fields is null / undefined
        const objectParams = this
        // update ở đâu và chỗ nào
        if (objectParams.product_attributes) {
            // update child
            await updateProductById({
                model: electronic,
                product_id,
                payload: objectParams
            })
        }

        const updateProduct = await super.updateProduct(product_id, objectParams)
        return updateProduct
    }
}

// define sub class for different product types Funiture
class Furniture extends Product {
    async createProduct() {
        const newFurniture = await furniture.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if (!newFurniture) throw new BadRequestError(`Create new Clothing error`)

        const newProduct = await super.createProduct(newFurniture._id)
        if (!newProduct) throw new BadRequestError(`Create new Product error`)

        return newProduct;
    }
}

// register product types 
ProductFactory.registerProductType('Electronics', Electronics)
ProductFactory.registerProductType('Clothing', Clothing)
ProductFactory.registerProductType('Furniture', Furniture)

module.exports = ProductFactory
