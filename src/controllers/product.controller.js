'use strict';

const { CREATED, SuccessResponse } = require('../core/success.response');
// const ProductService = require('../services/product.service');
const ProductService = require('../services/product.service.upgrade');

class ProductController {
  createProduct = async (req, res, next) => {
    // For v1
    // new SuccessResponse({
    //   message: 'Create new product success!',
    //   metadata: await ProductService.createProduct(req.body.product_type,{
    //     ... req.body,
    //     product_shop: req.user.userId
    //   }),
    // }).send(res);

    // For v2
    new SuccessResponse({
      message: 'Create new product success!',
      metadata: await ProductService.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId
      }),
    }).send(res);

  };
  /**
   * @desc Update product
   */
  updateProduct = async (req, res, next) => {
    // For v2
    new SuccessResponse({
      message: 'Update product success!',
      metadata: await ProductService.updateProduct(req.body.product_type, req.params.product_id, {
        ...req.body,
        product_shop: req.user.userId
      }),
    }).send(res);

  };

  /**
   * @desc publish product
   * @param {String} req id
   */
  publishProductByShop = async (req, res, next) => {
    // For v2
    new SuccessResponse({
      message: 'Published product success!',
      metadata: await ProductService.publishProductByShop({
        product_id: req.params.id,
        product_shop: req.user.userId
      }),
    }).send(res);

  };
  /**
   * @desc unpublish product
   * @param {String} req id
   */
  unPublishProductByShop = async (req, res, next) => {
    // For v2
    new SuccessResponse({
      message: 'UnPublished product success!',
      metadata: await ProductService.unPublishProductByShop({
        product_id: req.params.id,
        product_shop: req.user.userId
      }),
    }).send(res);
  };

  // QUERY  
  /**
   * @desc Get all draft for shop
   * @param {Number} req limit
   * @param {Number} req skip
   */
  getAllDraftsForShop = async (req, res, next) => {
    // For v2
    new SuccessResponse({
      message: 'All drafts is fetched!',
      metadata: await ProductService.findAllDraftForShop({
        product_shop: req.user.userId
      }),
    }).send(res);
  };

  /**
   * @desc Get all published for shop
   * @param {Number} req limit
   * @param {Number} req skip
   */
  getAllPublishedForShop = async (req, res, next) => {
    // For v2
    new SuccessResponse({
      message: 'All pubished is fetched!',
      metadata: await ProductService.findAllPublishedForShop({
        product_shop: req.user.userId
      }),
    }).send(res);

  };

  /**
   * @desc Full text search product
   * @param {Number} req limit
   * @param {Number} req skip
   */
  getListSearchProduct = async (req, res, next) => {
    // For v2
    new SuccessResponse({
      message: 'Get list search product successful!',
      metadata: await ProductService.searchProducts({
        ...req.params
      }),
    }).send(res);

  };

  /**
   * @desc find all prducts by option
   */
  findAllProducts = async (req, res, next) => {
    // For v2
    new SuccessResponse({
      message: 'Get list product successful!',
      metadata: await ProductService.findAllProducts(req.query),
    }).send(res);

  };

  /**
   * @desc find all prducts by option
   */
  findProduct = async (req, res, next) => {
    // For v2
    new SuccessResponse({
      message: 'Get  product successful!',
      metadata: await ProductService.findProduct({ ...req.params }),
    }).send(res);

  };
  // END QUERY
}

module.exports = new ProductController();
