var express = require('express'),
    path = require('path'),
    http = require('http'),
    contact = require('./routes/contacts'),
    home = require('./routes/home'),
    passport = require('passport');

var app = express();

//bootstrap passport config
require('./passport')(passport);


app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.use(express.logger('dev'));  /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser()),
    app.use(express.static(path.join(__dirname, 'public')));
    //use passport session
    app.use(passport.initialize());
    app.use(passport.session());
});

var requiresLogin = function(req, res, next) {
    next();
    /*var redirectURL = '/signin';
    if (!req.isAuthenticated()) {
    	return res.redirect(redirectURL);
    } else next();*/
};

app.post('/contacts/rePopulateDB', requiresLogin, contact.rePopulateDB);
app.get('/contacts', requiresLogin, contact.findAll);
app.get('/contacts/:id', requiresLogin, contact.findById);
app.post('/contacts', requiresLogin, contact.addcontact);
app.put('/contacts/:id', requiresLogin, contact.updatecontact);
app.delete('/contacts/:id', requiresLogin, contact.deletecontact);


app.get('/signin', home.getSignIn);
app.post('/signin', home.postSignIn);

http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});