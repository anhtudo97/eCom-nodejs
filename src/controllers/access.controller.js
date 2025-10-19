'use strict';

const { BadRequestError } = require('../core/error.response');
const { CREATED, SuccessResponse } = require('../core/success.response');
const AccessService = require('../services/access.service');

class AccessController {
  handleRefreshToken = async (req, res, next) => {
    // new SuccessResponse({
    //   message: 'Get token success!',
    //   metadata: await AccessService.handleRefreshToken(req.body.refreshToken),
    // }).send(res);

    //FIXED
    new SuccessResponse({
      message: 'Get token success!',
      metadata: await AccessService.handleRefreshToken({
        refreshToken: req.refreshToken,
        user: req.user,
        keyStore: req.keyStore
      }),
    }).send(res);
  };

  login = async (req, res, next) => {
    const { email } = req.body;
    if (!email) {
      throw new BadRequestError('Email is required');
    }

    const sendData = Object.assign(
      {
        requestId: req.requestId,
      },
      req.body,
    )

    const { code, ...result } = await AccessService.login(sendData);
    if (code === 200) {
      new SuccessResponse({
        metadata: result,
      }).send(res);
    } else {
      new ErrorResponse({
        metadata: result,
      }).send(res);
    }
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
