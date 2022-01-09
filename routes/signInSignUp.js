const express = require('express');
const controller = require('../controller/signInSignUp');
const verify = require ('./verifyToken');
const router = express.Router();

// ----------- Auth Post Routes -----------
router.post('/login', controller.logInPost);
router.post('/register', controller.registerPosts);
router.post('/googlelogin', controller.googleLogIn);
router.post('/resetpass', controller.passwordReset);
router.post('/updatenewpass', verify.resetPassToken, controller.passUpdate);


// ----------- Auth Get Routes -----------
//router.get('/r', controller.m);

module.exports = router;
