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
      metadata: await ProductServiceV2.createProduct(req.body.product_type,{
        ... req.body,
        product_shop: req.user.userId
      }),
    }).send(res);
  };
}

module.exports = new ProductController();
