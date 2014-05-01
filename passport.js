var LocalStrategy = require('passport-local').Strategy;
    //User = mongoose.model('user');

module.exports = function(passport) {
    //Serialize sessions
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findOne({
            _id: id
        }, function(err, user) {
            done(err, user);
        });
    });

    //Use local strategy
    passport.use(new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true
        },
        function(req, username, password, done) {
            var errorHandler = function(message){
                if(typeof message === "string"){
                    return done(null, false, {
                        message: message
                    });
                } else {
                    return done(message);
                }
            };

            User.findOne({
                username: username
            }, function(err, user) {
                if (err) return errorHandler(err);
                if (!user) return errorHandler("Unknown user");

                user.authenticate(password, function(err, isPasswordMatched){
                    if(err) return done(err);
                    if(!isPasswordMatched) return errorHandler("Invalid password");
                    if(!user.isEmailVerified) return errorHandler("Your account's mail id is not verified yet.");

                    return done(null, user);
                });
            });
        }
    ));
};