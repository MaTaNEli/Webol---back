const express = require('express');
const passport = require ('passport');
const jwt = require ('jsonwebtoken');
const controller = require('../controller/signInSignUp');

const router = express.Router();

router.post('/register', controller.registerPosts);


module.exports = router;