'use strict';

const { randomBytes } = require('crypto');
const apiKeyModel = require('../models/apiKey.model');

const findById = async (key) => {
  /*
    Create a new api key
  */
  // const newKey = await apiKeyModel.create({
  //   key: randomBytes(64).toString('hex'),
  //   permissions: ['0000'],
  // });
  // console.log('New Key', newKey);
  const objKey = await apiKeyModel.findOne({ key, status: true }).lean();
  return objKey;
};

module.exports = {
  findById,
};
