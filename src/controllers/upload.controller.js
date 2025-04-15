"use strict";

const { BadRequestError } = require("../core/error.response");
const { SuccessResponse } = require("../core/success.response");
const { uploadImageFromUrl, uploadImageFromLocal } = require("../services/upload.service");

class UploadController {
    updaloadFile = async (req, res, next) => {
        new SuccessResponse({
            message: "File uploaded successfully",
            metadata: await uploadImageFromUrl()
        }).send(res);
    }

    updaloadFileThumb = async (req, res, next) => {
        const { file } = req
        if (!file) {
            throw new BadRequestError()
        }
        new SuccessResponse({
            message: "File uploaded successfully",
            metadata: await uploadImageFromLocal({
                path: file.path
            })
        }).send(res);
    }
}

module.exports = new UploadController()