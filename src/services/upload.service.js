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

// 2. upload from local
const uploadImageFromLocal = async ({
    path,
    folderName = 'product/8400',
}) => {
    try {

        const result = await cloudinary.uploader.upload(path, {
            public_id: `thumb`,
            folder: folderName,
        })

        console.log(result)

        return {
            image_url: result.secure_url,
            shopId: 8400,
            thumb_url: await cloudinary.url(result.public_id, {
                height: 100,
                width: 100,
                format: 'webp',
                // size: 10
            })
        }
    } catch (error) {
        console.error(`Error uploading::`, error)
    }
}

module.exports = {
    uploadImageFromUrl,
    uploadImageFromLocal
}