'use strict';

const { CREATED, SuccessResponse } = require('../core/success.response');
const AccessService = require('../services/access.service');

class AccessController {
  login = async (req, res, next) => {
    console.log(111, req.body);
    new SuccessResponse({
      metadata: await AccessService.login(req.body),
    }).send(res)
  };

  signUp = async (req, res, next) => {
    console.log(`[P]::signUp::`, req.body);

    new CREATED({
      mesage: 'Registered OK!',
      metadata: await AccessService.signUp(req.body),
      options: {
        limit: 10
      }
    }).send(res);

    // return res.status(201).json(await AccessService.signUp(req.body));
  };
}

module.exports = new AccessController();
