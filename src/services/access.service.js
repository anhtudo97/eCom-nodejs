'use strict';

const shopModel = require('../models/shop.model');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const KeyTokenService = require('./keyToken.service');
const { createTokenPair } = require('../auth/authUtils');
const { getInfoData } = require('../utils');
const { BadRequestError, AuthFailureError } = require('../core/error.response');
const { findByEmail } = require('./shop.service');

const RoleShop = {
  SHOP: 'SHOP',
  WRITE: 'WRITER',
  EDITER: 'EDITER',
};

class AccessService {
  /*
    1 - check email in dbs
    2 - match password
    3 - create AT vs RT and save
    4 - generate tokens
    5 - get data return login 
  */
  static login = async ({ email, password, refreshToken = null }) => {
    // 1
    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new BadRequestError('Shop not register');

    // 2
    const match = await bcrypt.compare(password, foundShop.password);
    console.log(3333, match);
    if (!match) throw new AuthFailureError('Authentication error');

    //3
    // create public key and private key
    const publicKey = crypto.randomBytes(64).toString('hex');
    const privateKey = crypto.randomBytes(64).toString('hex');
    const { _id: userId } = foundShop;
    const tokens = await createTokenPair(
      { userId, email },
      publicKey,
      privateKey,
    );

    await KeyTokenService.createKeyToken({
      refreshToken: tokens.refreshToken,
      privateKey,
      publicKey,
      userId,
    });

    return {
      shop: getInfoData({
        fields: ['_id', 'name', 'email'],
        object: foundShop,
      }),
      tokens,
    };
  };

  static logout = async (keyStore) => {
    const deleteKey = await KeyTokenService.removeKeyById(keyStore._id);

    console.log(deleteKey);
    return deleteKey;
  };

  static signUp = async ({ name, email, password }) => {
    // try {
    // step 1: check email is exist?

    const holderShop = await shopModel.findOne({ email }).lean();

    if (holderShop) {
      throw new BadRequestError('Error: Shop already registered');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      roles: [RoleShop.SHOP],
    });

    if (newShop) {
      // created privateKey, publicKey
      // const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
      //   modulusLength: 4096,

      //   // reformat key
      //   publicKeyEncoding: {
      //     type: 'pkcs1',
      //     format: 'pem',
      //   },
      //   privateKeyEncoding: {
      //     type: 'pkcs1',
      //     format: 'pem',
      //   },
      // });

      const publicKey = crypto.randomBytes(64).toString('hex');
      const privateKey = crypto.randomBytes(64).toString('hex');

      // console.log({ privateKey, publicKey }); // save collection Keystore

      const keyStore = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey,
      });

      if (!keyStore) {
        throw new BadRequestError('Error: Shop already registered');
      }

      // Option to reconvert public key from string to Buffer object key
      // const publicKeyObject = crypto.createPublicKey(publicKeyString);
      // console.log(`Public key object`, publicKeyObject);

      const tokens = await createTokenPair(
        { userId: newShop._id, email },
        publicKey,
        privateKey,
      );

      console.log(`Created Token success`, tokens);

      return {
        code: 201,
        metadata: {
          shop: getInfoData({
            fields: ['_id', 'name', 'email'],
            object: newShop,
          }),
          tokens,
        },
      };
    }
    return {
      code: 200,
      metadata: null,
    };
    // } catch (error) {
    //   return {
    //     code: 'xxxx',
    //     message: error.message,
    //     status: 'error',
    //   };
    // }
  };
}

module.exports = AccessService;
