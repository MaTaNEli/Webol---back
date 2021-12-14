const express = require('express');
const passport = require ('passport');
const controller = require('../controller/signInSignUp');
const verify = require ('./verifyToken');
const router = express.Router();


 const initializePassport = require ('../config/passport')
 initializePassport(passport);

router.post('/register', controller.registerPosts);

//router.post('/login',controller.logInPost);

router.post('/login',passport.authenticate('local', {failureRedirect: '/login-faile', successRedirect: 'login-success'}));
 
router.get('/login-faile', controller.loginFailed);
router.get('/login-success', checkAuthenticated, controller.loginSuccess);

router.get('/matan', verify.token, controller.s);

router.delete('/logout', controller.logout);

module.exports = router;


function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({error: 'the user is not authenticated'})
}
  
// function checkNotAuthenticated(req, res, next) {
//     if (req.isAuthenticated()) {
//         return res.status(200).json("you already logged in")
//     }
//     next()
// }