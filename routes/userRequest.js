const express = require('express');
const controller = require('../controller/userRequest');
const verify = require ('./verifyToken');
const router = express.Router();

// ----------- Auth Post Routes -----------
router.post('/userimage/:image', verify.token, controller.postUserImage);
//router.post('/themeimage', verify.token, controller.postThemeImage);

// ----------- Auth Get Routes -----------
router.get('/userimage/:image', verify.token, controller.getUserImage);

module.exports = router;