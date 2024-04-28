'use strict';

const _ = require('lodash');
const { Types } = require('mongoose');

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

const convertToObjectMongodb = id => new Types.ObjectId(id)

module.exports = {
  getInfoData, getSelectData, unGetSelectData, removeUndefinedObject, updateNestedObjectParser, convertToObjectMongodb
};
