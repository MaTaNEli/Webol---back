const express = require('express');
const passport = require ('passport');
const controller = require('../controller/signInSignUp');
//const verify = require ('./verifyToken');
require('../config/google_passport');
const router = express.Router();


 const initializePassport = require ('../config/passport')
 initializePassport(passport);

// Auth Routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login-faile' }),
  function(req, res) {
    // Successful authentication, redirect home.
    console.log("10 calback line18 in router")
    res.redirect('/login-success');
  }
);

router.post('/register', controller.registerPosts);

router.post('/login',passport.authenticate('local', {
    failureRedirect: '/login-faile',
    successRedirect: 'login-success'
}));
 
router.get('/login-faile', controller.loginFailed);
router.get('/login-success', controller.loginSuccess);

router.get('/matan', checkAuthenticated, controller.s);

router.get('/logout', controller.logout);

module.exports = router;


function checkAuthenticated(req, res, next) {
    console.log(req.session)
    if (req.isAuthenticated()) {
        return next();
    }
    console.log("checkAuthenticated router line 44");
    res.status(200).json({error: 'the user is not authenticated'})
}
  
// function checkNotAuthenticated(req, res, next) {
//     if (req.isAuthenticated()) {
//         return res.status(200).json("you already logged in")
//     }
//     next()
// }