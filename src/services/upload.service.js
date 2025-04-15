"use strict";

const { forEach, forIn } = require("lodash");
const cloudinary = require("../configs/cloudinary.config");
const { PutObjectCommand, s3 } = require("../configs/s3.config");

// Using S3

// 1. UPLOAD IMAGE
const uploadImageFromLocalS3 = async ({
    file,
}) => {
    try {
        const command = new PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: file.originalname || 'unknown',
            Body: file.buffer,
            ContentType: 'image/jpeg' // that what u need
        })

        const result = await s3.send(command)

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

// Using CLOUDINARY

// 1. UPLOAD IMAGE FROM URL

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

// 2. UPLOAD IMG FORM LOCAL
const uploadImageFromLocalCloudinary = async ({
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

// 3. UPLOAD IMGS FORM LOCAL
const uploadImagesFromLocalCloudinary = async ({
    files,
    folderName = 'product/8400',
}) => {
    try {
        console.log(`files:: ${files} `, folderName)
        if (!files.length) return
        const uploadedUrl = []
        for (const file of files) {
            console.log("file", file)
            const result = await cloudinary.uploader.upload(file.path, {
                folder: folderName,
            })

            uploadedUrl.push({
                image_url: result.secure_url,
                shopId: 8400,
                thumb_url: await cloudinary.url(result.public_id, {
                    height: 100,
                    width: 100,
                    format: 'webp',
                    // size: 10
                })
            })
        }
        return uploadedUrl
    } catch (error) {
        console.error(`Error uploading::`, error)
    }
}

module.exports = {
    uploadImageFromLocalS3,
    uploadImageFromUrl,
    uploadImageFromLocal: uploadImageFromLocalCloudinary,
    uploadImagesFromLocalCloudinary
}