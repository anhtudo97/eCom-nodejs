const AccessControl = require('accesscontrol');

const grants = [
    // role ADMIN
    // { resource: 'admin', resource: 'profile', actions: ['create', 'read', 'update', 'delete'], attributes: '*, !views' },
    { role: 'admin', resource: 'profile', action: 'read:any', attributes: ['*'] },  

    // role USER
    // { resource: 'shop', resource: 'profile', actions: ['read', 'update'], attributes: '*' },
    { role: 'shop', resource: 'profile', action: 'read:own', attributes: ['*'] },
]

module.exports = new AccessControl(grants);