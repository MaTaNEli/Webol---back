const express = require('express');
const passport = require ('passport');

const router = express.Router();

const isLoggedIn = (req, res, next) => {
    if (req.user) next();
    else res.status(401).json('not logged in');
};


router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/failed' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/good');
  });


router.get('/failed', (req, res) => res.status(200).json('you have failed to log in'));

router.get('/', (req, res) => {
    res.status(200).json('hi matan')
});

router.get('/good', isLoggedIn, (req, res) => {
    res.status(200).json(`you log in, welcom mr ${req.user.displayName}`);
});

router.get('/logout', (req, res) => {
    req.session = null;
    req.logOut();
    res.redirect('/')
});

module.exports = router;