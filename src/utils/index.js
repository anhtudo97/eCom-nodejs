'use strict';

const { getSignedUrl } = require("@aws-sdk/cloudfront-signer"); // CJS
const crypto = require("crypto")
const REDIS_URL = "redis://127.0.0.1:6379"
const _ = require('lodash');
const { Types } = require('mongoose');

const randomImageName = () => crypto.randomBytes(16).toString("hex")

const getInfoData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields);
};

const getSelectData = (select = []) => {
  return Object.fromEntries(select.map(el => [el, 1]))
}

const unGetSelectData = (select = []) => {
  return Object.fromEntries(select.map(el => [el, 0]))
}

const removeUndefinedObject = obj => {
  Object.keys(obj).forEach(key => {
    if (obj[key] && typeof obj[key] === 'object') removeUndefined(obj[key]);
    else if (obj[key] == null) delete obj[key];
  });

  return obj;

}


/**
 * const a = {
 *  c: {
 *    d: 1,
 *    c: 2
 *  }
 * }
 *  save to db will follow
 *  db.collection.updateOne({
 *      `c.d`: 1,
 *      `c.c`: 2
 *  })
*/
const updateNestedObjectParser = object => {
  const final = {};
  console.log('[1] ::: ', object)
  Object.keys(object).forEach(key => {
    if (typeof object[key] === 'object' && !Array.isArray(object[key])) {
      const response = updateNestedObjectParser(object[key]);

      Object.keys(response).forEach(a => {
        final[`${key}.${a}`] = response[a];
      });
    } else {
      final[key] = object[key];
    }
  });

  console.log('[2] ::: ', final)

  return final;
}

const convertToObjectIdMongodb = id => new Types.ObjectId(id)

const getNewUrlSigner = (url, date) => {
  const privateKey = process.env.AWS_S3_CLOUDFRONT_PRIVATE_KEY;
  const keyPairId = process.env.AWS_S3_CLOUDFRONT_PUBLIC_KEY;
  const dateLessThan = date; // any Date constructor compatible

  const signedUrl = getSignedUrl({
    url,
    keyPairId,
    dateLessThan,
    privateKey,
  });

  return signedUrl
}

const replacePlaceholders = (template, placeholders) => {
  Object.keys(placeholders).forEach(key => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    template = template.replace(regex, placeholders[key]);
  });
  return template;
};

module.exports = {
  REDIS_URL,
  getInfoData,
  randomImageName,
  getSelectData,
  unGetSelectData,
  removeUndefinedObject,
  updateNestedObjectParser,
  convertToObjectIdMongodb,
  getNewUrlSigner,
  replacePlaceholders
};
