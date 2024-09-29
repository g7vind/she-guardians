// const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Place = require('../models/places');
const AWS = require('aws-sdk');
require('dotenv').config();
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const accessKeyId = process.env.ACCESS_KEY_ID;
const secretAccessKey = process.env.SECRET_ACCESS;

const s3 = new AWS.S3({
    region : process.env.REGION,
    credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey
    }
}
);

router.post('/upload', upload.single('imageFile'), (req, res) => {
    const file = req.file;
    // const newStaff = mongoose.Types.ObjectId('your_string_value');
    const newStaff = req.body.staff;
    const newName = req.body.name;
    const newLocation = req.body.location;
    const newPhone = req.body.contact;
    try {
        const s3FileURL = `https://${process.env.BUCKET_NAME}.s3.amazonaws.com/${file.originalname}`;
        const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: file.originalname,
            Body: file.buffer,
            ContentType: file.mimetype
        };

        s3.upload(params, async (err, data) => {
            if (err) {
                return res.status(500).json({ error: true, Message: err });
            }

            const place = new Place({
                name: newName,
                staff: newStaff,
                location: newLocation,
                contact: newPhone,
                Image: s3FileURL
            });
            await place.save();

            res.send({ message: 'Upload successful', data: place });
        });
    } catch (err) {
        res.status(500).json({ error: true, Message: err });
    }
});


module.exports = router;
