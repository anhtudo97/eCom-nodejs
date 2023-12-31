'use strict';

const keytokenModel = require('../models/keytoken.model');
const { Types } = require('mongoose');
class KeyTokenService {

  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    try {
      // publicKey is hash <=> Buffer need convert to String to save db
      // const publicKeyString = publicKey.export({ format: 'pem', type: 'spki' });
      const publicKeyString = publicKey.toString();

      console.log(`Public key string: ${publicKeyString}`);

      // level 0
      // const tokens = await keytokenModel.create({
      //   user: userId,
      //   publicKey,
      //   privateKey,
      // });

      // level 1
      const filter = { user: userId },
        update = {
          publicKey,
          privateKey,
          refreshTokenUsed: [],
          refreshToken,
        },
        options = { upsert: true, new: true };

      const tokens = await keytokenModel.findOneAndUpdate(
        filter,
        update,
        options,
      );

      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return {
        code: 'xxxx',
        message: error.message,
        status: 'error',
      };
    }
  };

  static findByUserId = async (userId) => {
    return await keytokenModel.findOne({ user: new Types.ObjectId(userId) })
  };

  static removeKeyById = async (id) => {
    return await keytokenModel.deleteOne(id);
  };

  static findByRefreshTokenUsed = async refreshToken => {
    return await keytokenModel.findOne({ refreshTokensUsed: refreshToken }).lean();
  }


  static findByRefreshToken = async refreshToken => {
    return await keytokenModel.findOne({ refreshToken })
  }

  static deleteKeyById = async userId => {
    return await keytokenModel.deleteOne({ user: new Types.ObjectId(userId) })
  }
}

module.exports = KeyTokenService;
