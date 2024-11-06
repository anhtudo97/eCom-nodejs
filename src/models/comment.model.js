'use strict'

const { model, Schema } = require('mongoose')

const DOCUMENT_NAME = 'Comment';
const COLLECTION_NAME = 'Comments';

// Declare the Schema of the Mongo model
var commentSchema = new Schema(
    {
        comment_productId: { type: Schema.Types.ObjectId, ref: 'Product' },
        comment_parentId: { type: Schema.Types.ObjectId, ref: DOCUMENT_NAME },
        comment_userId: { type: Number, default: 1 },
        comment_content: { type: String, default: 'text' },
        comment_left: { type: Number, default: 0 }, // 10,000
        comment_right: { type: Number, default: 0 }, // 10,000
        isDeleted: { type: Boolean, default: false }, // discount code
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    },
);

//Export the model
module.exports = model(DOCUMENT_NAME, commentSchema);