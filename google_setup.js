const passport = require ('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.serializeUser(function(user, done) {
    //done(null, user.id);
    done(null, user);
});
  
passport.deserializeUser(function(user, done) {
    // User.findById(id, function(err, user) {
    //   done(null, user);
    // }); 
    done(null, user);
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: process.env.CALL_BACK
  },
  function(accessToken, refreshToken, profile, done) {
    // User.findOrCreate({ googleId: profile.id }, function (err, user) {
    //   return done(err, user);
    // });
    return done(null, profile);
  }
));