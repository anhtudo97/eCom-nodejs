"use strict";

const cloudinary = require("../configs/cloudinary.config");

// 1. upload from url image

const uploadImageFromUrl = async () => {
    try {
        const url = 'https://images.viblo.asia/89f2f7da-820b-4a96-b8ad-9e29407de7e3.png';
        const folderName = 'product/8400'
        const newFileName = 'test_demo'

        const result = await cloudinary.uploader.upload(url, {
            public_id: `${newFileName}`,
            folder: folderName,
        })

        console.log(result)

        return result
    } catch (error) {

    }
}

module.exports = {
    uploadImageFromUrl,
}