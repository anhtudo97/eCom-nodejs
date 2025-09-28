'use strict';

const { AuthFailureError } = require('../core/error.response');
const rbac = require('./role.middleware');

// RBAC - Role Based Access Control
/**
 * @param {string} action // read, create, update, delete
 * @param {string} resource  // profile, balance
 * @returns 
 */
const grantAccess = (action, resource) => {
    return async (req, res, next) => {
        try {
            const role = req.query.role;
            const permission = rbac.can(role)[action](resource);
            if (!permission.granted) {
                throw new AuthFailureError('You do not have enough permission to perform this action');
            }
            next()
        } catch (error) {
            next(error)
        }
    }
}

module.exports = {
    grantAccess
}