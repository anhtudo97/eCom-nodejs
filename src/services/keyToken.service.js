'use strict';

const keytokenModel = require('../models/keytoken.model');

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
}

module.exports = KeyTokenService;
