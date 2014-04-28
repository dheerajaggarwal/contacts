var express = require('express'),
    path = require('path'),
    http = require('http'),
    contact = require('./routes/contacts');

var app = express();

app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.use(express.logger('dev'));  /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser()),
    app.use(express.static(path.join(__dirname, 'public')));
});

app.post('/contacts/rePopulateDB', contact.rePopulateDB);
app.get('/contacts', contact.findAll);
app.get('/contacts/:id', contact.findById);
app.post('/contacts', contact.addcontact);
app.put('/contacts/:id', contact.updatecontact);
app.delete('/contacts/:id', contact.deletecontact);

http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});
