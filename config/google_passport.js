// const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const connection = require('./database');
// const User = connection.models.User;

// passport.serializeUser(function(user, done) {
//     /*
//     From the user take just the id (to minimize the cookie size) and just pass the id of the user
//     to the done callback
//     PS: You dont have to do it like this its just usually done like this
//     */
//     done(null, user._id);
//   });
  
// passport.deserializeUser(function(userid, done) {
//     /*
//     Instead of user this function usually recives the id 
//     then you use the id to select the user from the db and pass the user obj to the done callback
//     PS: You can later access this data in any routes in: req.user
//     */
//     User.findById({_id: userid})
//             .then((user) => {
//                 done(null, user);
//             })
//             .catch(err => done(err))
//     done(null, userid);
// });

// passport.use(new GoogleStrategy({
//     clientID: process.env.GOOGLE_ID,
//     clientSecret: process.env.GOOGLE_SECRET,
//     callbackURL: process.env.CALL_BACK
//   },
//   async function(accessToken, refreshToken, profile, done) {
//     console.log("0");
//     /* use the profile info (mainly profile id) to check if the user is registerd in ur db
//     If yes select the user and pass him to the done callback
//     If not create the user and then select him and pass to callback */

  
//     await User.findOne({email: profile.emails[0].value})
//     .then((user) =>{
//         if (user){
//             console.log("1");
//             return done(null, user);
//         } 
//     })
//     .catch (e => console.log(e, "Error in find user in db line 29 controller/signInSignUp"));
//     console.log("2");
//     const newUser = new User({
//         username: profile.displayName,
//         email: profile.emails[0].value,
//         full_name: profile.displayName,
//         logedin: true
//     })
//     try{
//         console.log("3");
//         // Save the user in DB
//         await newUser.save().then((user) => console.log(user)) 
//     } catch (err) {
//         console.log("4");
//         console.log(err, "in config/google_passport catch the err line 60")
//         return done(null, false);
//     }
    
//     //console.log(profile, "profile");
//     await User.findOne({email: profile.emails[0].value})
//     .then((user) =>{
//         if (user){
//             console.log("5");
//             return done(null, user);
//         } 
//     })
//     .catch (e => console.log(e, "Error in find user in db line 29 controller/signInSignUp"));
//   }
// ));