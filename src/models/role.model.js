'use strict';

const { model, Schema } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Role';
const COLLECTION_NAME = 'Roles';

// Declare the Schema of the Mongo model
// Role for assign permissions to User
var roleSchema = new Schema(
    {
        role_name: { type: String, default: 'user', enum: ['user', 'admin', 'shop'] }, // profile
        role_slug: { type: Number, required: true }, // 00001
        role_status: { type: String, default: 'active', enum: ['active', 'pending', 'block'] }, // 00001
        role_description: { type: String, default: "" },
        role_grants: [
            {
                resource: { type: Schema.Types.ObjectId, ref: 'Resource', required: true },
                actions: [{ type: String, required: true }], // ['create', 'read', 'update', 'delete'
                attributes: { type: String, default: '*' } // ['*'] or ['name', 'description']
            }
        ], // List resource
    },
    {
        collection: COLLECTION_NAME,
        timestamps: {
            createdAt: 'createdOn',
            updatedAt: 'modifiedOn'
        }
    },
);

// const grants = [
//     // role ADMIN
//     { resource: 'profile', actions: ['create', 'read', 'update', 'delete'], attributes: '*' },
//     { resource: 'balance', actions: ['create', 'read', 'update', 'delete'], attributes: '*, !amount' },

//     // role USER
//     { resource: 'profile', actions: ['read', 'update'], attributes: '*' },
//     { resource: 'balance', actions: ['read'], attributes: '*, !amount' },
// ]

//Export the model
module.exports = {
    role: model(DOCUMENT_NAME, roleSchema)
}
