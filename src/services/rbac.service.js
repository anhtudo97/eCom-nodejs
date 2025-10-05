'use strict';

const { resource } = require("../models/resource.model");
const { role } = require("../models/role.model");

/**
 * Create a new resource
 * @param {String} name
 * @param {String} slug
 * @param {String} description
 */
const createResource = async ({ name = 'profile', slug = 'p0001', description = '' }) => {
    try {
        // 1. check name or slug exist
        const existingResource = await resource.findOne({ slug });
        if (existingResource) {
            throw new Error('Resource already exists');
        }

        // 2.    create new resource
        const newResource = await resource.create({
            src_name: name,
            src_slug: slug,
            src_description: description
        });

        return newResource;
    } catch (error) {
        throw new Error(error.message);
    }
}

/**
 * List of resources
 * @param {Number} userId
 * @param {Number} limit
 * @param {Number} offset
 * @param {String} search
 */
const resourceList = async ({ userId = 0, limit = 30, offset = 0, search = '' }) => {
    try {
        // 1. check is admin
        if (userId !== 1) return []

        // 2. get resources
        const resources = await resource.aggregate([
            {
                $project: {
                    _id: 1,
                    name: '$src_name',
                    slug: '$src_slug',
                    description: '$src_description',
                    resourceId: '$_id',
                    createdAt: 1
                }
            },
            { $limit: limit },
            { $skip: offset }
        ]);

        return resources;
    } catch (error) {
        return []
    }
}

/**
 * Create a new role
 * @param {String} name
 * @param {String} slug
 * @param {String} description
 * @param {Array} grants
 */
const createRole = async ({ name, slug, description, grants }) => {
    try {
        // 1. check name or slug exist
        const existingRole = await role.findOne({ slug });
        if (existingRole) {
            throw new Error('Role already exists');
        }

        // 2. create new role
        const newRole = await role.create({
            role_name: name,
            role_slug: slug,
            role_description: description,
            role_grants: grants
        });

        return newRole;
    } catch (error) {
        throw new Error(error.message);
    }
}

/**
 * List all roles
 * @param {Number} userId
 * @param {Number} limit
 * @param {Number} offset
 * @param {String} search
 */
const roleList = async ({ userId = 0, limit = 30, offset = 0, search = '' }) => {
    try {
        // 1. check is admin
        if (userId !== 1) return []

        // 2. get roles
        const roles = await role.aggregate([
            {
                $project: {
                    _id: 1,
                    name: '$role_name',
                    slug: '$role_slug',
                    description: '$role_description',
                    createdAt: 1
                }
            },
            { $limit: limit },
            { $skip: offset }
        ]);

        return roles;
    } catch (error) {
        return []
    }
}

module.exports = {
    createResource,
    resourceList,
    createRole,
    roleList
}