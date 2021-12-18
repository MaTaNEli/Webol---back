const express = require('express');
const controller = require('../controller/signInSignUp');
const verify = require ('./verifyToken');
const router = express.Router();

// Auth Routes

router.post('/register', controller.registerPosts);

router.post('/login', controller.logInPost);

router.post('/googlelogin', controller.googleLogIn)

router.get('/matan', verify.token, controller.s);

module.exports = router;
