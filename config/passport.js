const LocalStrategy = require ('passport-local').Strategy;
const bcrypt = require ('bcryptjs');
const connection = require('./database');
const User = connection.models.User;


function initialize(passport) {
    const authenticateUser = async (email, password ,done) => {
        console.log(email, password)
        User.findOne({email: email})
        .then(async (user) =>{
            if (!user){
                return done(null, false);
            }

            if (await bcrypt.compare(password, user.password)){
                console.log("passport line 17")
                return done(null, user);
            } else {
                return done(null, false);
            }
        }).catch(e => console.log(e));
    };

    passport.use(new LocalStrategy({usernameField: 'username'}, authenticateUser));


    passport.serializeUser((user, done) => {
        console.log(user, "im the user from config/passport line 29");
        done(null, user._id);
    });

    passport.deserializeUser((userId, done) => {
        console.log(userId, "adsvbgfnhgfdsgdvsfdbgbfbfsbsdvsdv")
        User.findById({_id: userId})
            .then((user) => {
                done(null, user);
            })
            .catch(err => done(err))
    });
};

module.exports = initialize;