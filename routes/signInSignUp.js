const express = require('express');
const passport = require ('passport');
const controller = require('../controller/signInSignUp');
const verify = require ('./verifyToken');
const router = express.Router();


// const initializePassport = require ('../config/passport')
// initializePassport(passport);

router.post('/register', controller.registerPosts);

router.post('/login', controller.logInPost);

//router.get('/login-faile', controller.notSignIn);
//router.get('/login-success', controller.logInPost);

router.get('/matan', verify.token, controller.s);

router.delete('/logout', controller.logout);

module.exports = router;


// function checkAuthenticated(req, res, next) {
//     if (req.isAuthenticated()) {
//         return next();
//     }
//     res.json({error: 'could not find any user'})
// }
  
// function checkNotAuthenticated(req, res, next) {
//     if (req.isAuthenticated()) {
//         return res.status(200).json("you already logged in")
//     }
//     next()
// }