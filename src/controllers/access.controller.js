'use strict';

const { CREATED, SuccessResponse } = require('../core/success.response');
const AccessService = require('../services/access.service');

class AccessController {
  login = async (req, res, next) => {
    new SuccessResponse({
      metadata: await AccessService.login(req.body),
    }).send(res);
  };

  logout = async (req, res, next) => {
    new SuccessResponse({
      message: 'Logout success!',
      metadata: await AccessService.logout(req.keyStore),
    }).send(res);
  };

  signUp = async (req, res, next) => {
    console.log(`[P]::signUp::`, req.body);

    new CREATED({
      mesage: 'Registered OK!',
      metadata: await AccessService.signUp(req.body),
      options: {
        limit: 10,
      },
    }).send(res);

    // return res.status(201).json(await AccessService.signUp(req.body));
  };
}

module.exports = new AccessController();
