"use strict";


const cloudinary = require("../configs/cloudinary.config");
const { PutObjectCommand, s3, GetObjectCommand } = require("../configs/s3.config");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { randomImageName } = require("../utils");

// Using S3

// 1. UPLOAD IMAGE
const uploadImageFromLocalS3 = async ({
    file,
}) => {
    try {
        console.log("file::: ", file)
        const imageName = randomImageName()
        const command = new PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: imageName || 'unknown',
            Body: file.buffer,
            ContentType: 'image/jpeg' // that what u need
        })

        await s3.send(command)
        const signalUrl = new GetObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: imageName,
        })

        const url = await getSignedUrl(s3, signalUrl, { expiresIn: 3000 })
        console.log("url::", url)

        return url
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