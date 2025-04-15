"use strict";

const { BadRequestError } = require("../core/error.response");
const { SuccessResponse } = require("../core/success.response");
const { uploadImageFromUrl, uploadImageFromLocal, uploadImageFromLocalS3, uploadImagesFromLocalCloudinary } = require("../services/upload.service");

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

    updaloadFilesThumb = async (req, res, next) => {
        const { files } = req
        if (!files.length) {
            throw new BadRequestError()
        }
        new SuccessResponse({
            message: "File uploaded successfully",
            metadata: await uploadImagesFromLocalCloudinary({
                files
            })
        }).send(res);
    }

    // use s3
    updaloadFileLocalS3 = async (req, res, next) => {
        const { file } = req
        if (!file) {
            throw new BadRequestError("File missing")
        }
        new SuccessResponse({
            message: "File uploaded successfully using s3 client",
            metadata: await uploadImageFromLocalS3({
                file
            })
        }).send(res);
    }
}

module.exports = new UploadController()