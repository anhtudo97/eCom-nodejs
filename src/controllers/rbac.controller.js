'use strict';

const { SuccessResponse } = require("../core/success.response");
const { createRole, roleList, createResource, resourceList } = require("../services/rbac.service");

/**
 * Create a new role
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const newRole = async (req, res, next) => {
    new SuccessResponse({
        message: 'Create new role success',
        metadata: await createRole(req.body)
    }).send(res)
}

const listRole = async (req, res, next) => {
    new SuccessResponse({
        message: 'List of roles',
        metadata: await roleList({
            userId: req.user?.userId,
            limit: req.query?.limit,
            offset: req.query?.offset,
            search: req.query?.search
        })
    }).send(res)
}

const newResource = async (req, res, next) => {
    new SuccessResponse({
        message: 'Create new resource success',
        metadata: await createResource(req.body)
    }).send(res)
}

const listResource = async (req, res, next) => {
    new SuccessResponse({
        message: 'List of resources',
        metadata: await resourceList(req.query)
    }).send(res)
}

module.exports = {
    newRole,
    listRole,
    newResource,
    listResource,
}
