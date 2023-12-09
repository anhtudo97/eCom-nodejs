'use strict';

const { clothing, electronic, product, furniture } = require('../models/product.model');
const { BadRequestError } = require('../core/error.response');
const { findAllDraftForShop, publishProductByShop, findAllPublishedForShop, unPublishProductByShop, searchProductByUser, findAllProducts, findProduct } = require('../models/repositories/product.repository');
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
        return await product.create({
            ...this,
            _id: product_id
        })
    }
}

// define sub class for different product types Clothing
class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothing.create(this.product_attribute)
        if (!newClothing) throw new BadRequestError(`Create new Clothing error`)

        const newProduct = await super.createProduct()
        if (!newProduct) throw new BadRequestError(`Create new Product error`)

        return newProduct;
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
}

// define sub class for different product types Funiture
class Funiture extends Product {
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
ProductFactory.registerProductType('Furniture', Funiture)

module.exports = ProductFactory
