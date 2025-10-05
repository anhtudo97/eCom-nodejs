'use strict';

const { model, Schema } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Resource';
const COLLECTION_NAME = 'Resources';

// Declare the Schema of the Mongo model
// Resource for assign permissions to Role
var resourceSchema = new Schema(
    {
        src_name: { type: String, required: true }, // profile
        src_slug: { type: String, required: true }, // 00001
        src_description: { type: String, default: "" },
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
    resource: model(DOCUMENT_NAME, resourceSchema)
}
