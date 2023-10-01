'use strict';

const keytokenModel = require('../models/keytoken.model');

class KeyTokenService {
  static createKeyToken = async ({ userId, publicKey, privateKey }) => {
    try {
      // publicKey is hash <=> Buffer need convert to String to save db
      // const publicKeyString = publicKey.export({ format: 'pem', type: 'spki' });
      const publicKeyString = publicKey.toString();

      console.log(`Public key string: ${publicKeyString}`);

      const tokens = await keytokenModel.create({
        user: userId,
        publicKey,
        privateKey,
      });

      return tokens || null;
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
