"use strict";

const multer = require("multer");

const uploadMemory = multer({
    storage: multer.memoryStorage()
})

// save local temporary => high performance to show preview
const uploadDisk = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, "./src/uploads/");
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + "-" + file.originalname);
        }
    })

});

module.exports = {
    uploadMemory,
    uploadDisk
};