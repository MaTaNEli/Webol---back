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
    clientID: '957907069997-o1r7rknjq068vjfv4r2fis01pcqohq0n.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: "http://localhost:8080/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    // User.findOrCreate({ googleId: profile.id }, function (err, user) {
    //   return done(err, user);
    // });
    return done(null, profile);
  }
));