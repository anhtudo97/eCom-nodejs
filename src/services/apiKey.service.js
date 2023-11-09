'use strict';

const { randomBytes } = require('crypto');
const apiKeyModel = require('../models/apiKey.model');

const findById = async (key) => {
  const newKey = apiKeyModel.create({
    key: randomBytes(64).toString('hex'),
    permissions: ['0000'],
  });
  console.log(newKey);
  const objKey = await apiKeyModel.findOne({ key, status: true }).lean();
  return objKey;
};

module.exports = {
  findById,
};
