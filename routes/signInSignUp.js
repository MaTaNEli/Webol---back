const express = require('express');
const passport = require ('passport');
const jwt = require ('jsonwebtoken');
const controller = require('../controller/signInSignUp');
const { initialize } = require('passport');
const router = express.Router();

const initializePassport = require ('../config/passport')
initializePassport(passport);

router.post('/register', controller.registerPosts);

router.post('/login', passport.authenticate('local', {
    failureFlash: true, failureRedirect: '/failedToSignIn',
}), controller.logInPost);

router.get('/failedToSignIn', controller.notSignIn);


module.exports = router;


// router.get('/', (req, res) => {
//     res.status(200).json({matan: 'matan'})
//     if (req.session.viewCount)
//     {
//         req.session.viewCount++
//     }else{
//         req.session.viewCount = 1;
//     }
//     res.status(200).json(`${req.session.viewCount}`);
// });