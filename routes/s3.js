const express = require('express');
const s3 = require('../s3Connect/s3');
const verify = require ('./verifyToken');
const router = express.Router();

// ----------- Auth Post Routes -----------
router.get('/geturl', async (req, res) =>{
    const url = await s3.generateUploadURL();
    res.status(200).json(url);
});

// ----------- Auth Get Routes -----------
//router.get('/matan', verify.token, controller.s);

module.exports = router;
