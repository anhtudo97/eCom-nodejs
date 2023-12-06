'use strict';

const { CREATED, SuccessResponse } = require('../core/success.response');
const ProductService = require('../services/product.service');
const ProductServiceV2 = require('../services/product.service.xxx');

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
      metadata: await ProductServiceV2.createProduct(req.body.product_type, {
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
      metadata: await ProductServiceV2.publishProductByShop({
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
      metadata: await ProductServiceV2.unPublishProductByShop({
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
      metadata: await ProductServiceV2.findAllDraftForShop({
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
      metadata: await ProductServiceV2.findAllPublishedForShop({
        product_shop: req.user.userId
      }),
    }).send(res);

  };
  // END QUERY
}

module.exports = new ProductController();
