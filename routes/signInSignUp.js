const express = require('express');
const passport = require ('passport');
const jwt = require ('jsonwebtoken');
const controller = require('../controller/signInSignUp');
const auth = require ('./authenticated')

const router = express.Router();

router.post('/register', controller.registerPosts);

router.post('/login', passport.authenticate('local', {
    failureRedirect: '/blabla',
    failureFlash: true
    }),controller.logInPost);

router.get('/blabla', (req, res) =>{
    res.status(200).json('this is the end')
});

router.get('/imin', controller.logInPost);

module.exports = router;