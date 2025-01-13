'use strict'

const { model, Schema } = require('mongoose')

const DOCUMENT_NAME = 'Notification';
const COLLECTION_NAME = 'Notifications';

// ORDER-001: order successfully
// ORDER-002: order fail
// PROMOTION-001: new promotion
// SHOP-001: new product by User following

// Declare the Schema of the Mongo model
var commentSchema = new Schema(
    {
        noti_type: { type: String, enum: ['ORDER-001', 'ORDER-002', 'PROMOTION-001', 'SHOP-001'], require: true },
        noti_senderId: { type: Schema.Types.ObjectId, require: true, ref: "Shop" },
        noti_recivedId: { type: String, require: true },
        noti_content: { type: String, require: true },
        noti_options: { type: Object, default: {} }
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    },
);

//Export the model
module.exports = {
    noti: model(DOCUMENT_NAME, commentSchema)
}