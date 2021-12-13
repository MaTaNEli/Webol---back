const LocalStrategy = require ('passport-local').Strategy;
const bcrypt = require ('bcryptjs');
const DB = require ('./database');

function initialize(passport) {
    const authenticateUser = async (email, password ,done) => {
        console.log(email, password)
        const user = DB.searcInDB(email);
        if (!user){
            return done(null, false, {message: 'the user could not find'});
        } 

        if (await bcrypt.compare(password, user.password)){
            return done(null, user);
        } else {
            return done(null, false, {message: 'Password incorrect'});
        }
        
    }

    passport.use(new LocalStrategy({usernameField: 'username'}, authenticateUser));


    passport.serializeUser((user, done) => {
        done(null, user);
    });
    
    passport.deserializeUser((user, done) => {
        const userid = DB.searcIdInDB(user.id);
        console.log(userid, "23435467687");
        if (userid){
            return done(null, userid);
        } else {
            return done(null, false);
        }
    });
};

module.exports = initialize;