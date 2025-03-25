"use strict";

const { SuccessResponse } = require("../core/success.response");
const { uploadImageFromUrl } = require("../services/upload.service");

class UploadController {
    updaloadFile = async (req, res, next) => {
        new SuccessResponse({
            message: "File uploaded successfully",
            metadata: await uploadImageFromUrl()
        }).send(res);
    }
}

module.exports = new UploadController()