var passport = require('passport');

exports.getSignIn = function(req, res, next){
    res.render('signin');
};

exports.postSignIn = function(req, res, next){
    passport.authenticate('local', function(err, user, info) {
        if (!err && !user) {
            err = info.message;
        }
        if(err){
            return responseHandler(err, req, res);
        } else {
            req.logIn(user, function(err) {
                return responseHandler(err, req, res, user, null, 'user');
            });
        }
    })(req, res, next);
};
