'use strict';

const { model, Schema } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'User';
const COLLECTION_NAME = 'Users';

// Declare the Schema of the Mongo model
var userSchema = new Schema(
    {
        usr_id: { type: Number, required: true },
        usr_slug: { type: Number, required: true },
        usr_name: { type: Number, default: "" },
        usr_password: { type: Number, default: "" },
        usr_salf: { type: Number, default: "" },
        usr_email: { type: Number, required: true },
        usr_phone: { type: Number, default: "" },
        usr_sex: { type: Number, default: "" },
        usr_avatar: { type: Number, default: "" },
        usr_date_of_birth: { type: Date, default: null },
        usr_role: { type: Schema.Types.ObjectId, ref: 'Role', },
        usr_status: { type: String, default: 'pending', enum: ['active', 'inactive', 'pending', 'block'] },
    },
    {
        collection: COLLECTION_NAME,
        timestamps: {
            createdAt: 'createdOn',
            updatedAt: 'modifiedOn'
        }
    },
);

//Export the model
module.exports = {
    user: model(DOCUMENT_NAME, userSchema)
}
