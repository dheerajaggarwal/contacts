var mongo = require('mongodb'),
    _ = require('underscore');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('contactdb', server, {safe: true});

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'contactdb' database");
        db.collection('contacts', {safe:true}, function(err, collection) {
            if (err) {
                console.log("The 'contacts' collection doesn't exist. Creating it with sample data...");
                populateDB();
            }
        });
    }
});

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving contact: ' + id);
    db.collection('contacts', function(err, collection) {
        collection.findOne({'_id': new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};

exports.findAll = function(req, res) {
    db.collection('contacts', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

var isValidContact = function(contact){
    var errors = {}, lengthLimit = 35, 
        i, count, field;

    var requiredFields = ['name'],
        limitedLengthFields = ['name', 'designation', 'country', 'organization'];
    
    for(i = 0, count = requiredFields.length; i < count; i++){
        if(!contact[requiredFields[i]]){
            errors[requiredFields[i]] = "required field";
        }
    }

    for(i = 0, count = limitedLengthFields.length; i < count; i++){
        field = limitedLengthFields[i];
        if(!errors[field] && contact[field] && contact[field].length > lengthLimit){
            errors[field] = "field length cannot be greater than " + lengthLimit;
        }
    }

    if(_.isEmpty(errors)){
        return true;
    }
    return errors;
};

exports.addcontact = function(req, res) {
    var contact = req.body;
    console.log('Adding contact: ' + JSON.stringify(contact));
    db.collection('contacts', function(err, collection) {
        var isValid = isValidContact(contact);
        if(isValid === true){
            collection.insert(contact, {safe:true}, function(err, result) {
                if (err) {
                    res.send(400, {'error':'An error has occurred'});
                } else {
                    console.log('Success: ' + JSON.stringify(result[0]));
                    res.send(result[0]);
                }
            });
        } else {
            res.send(400, {errors: isValid});
        }
    });
}

exports.updatecontact = function(req, res) {
    var id = req.params.id;
    var contact = req.body;
    delete contact._id;
    console.log('Updating contact: ' + id);
    console.log(JSON.stringify(contact));
    db.collection('contacts', function(err, collection) {
        var isValid = isValidContact(contact);
        if(isValid === true){
            collection.update({'_id': new BSON.ObjectID(id)}, contact, {safe:true}, function(err, result) {
                if (err) {
                    console.log('Error updating contact: ' + err);
                    res.send(400, {'error': 'An error has occurred'});
                } else {
                    console.log('' + result + ' document(s) updated');
                    res.send(contact);
                }
            });    
        } else {
            res.send(400, {errors: isValid});
        }
    });
}

exports.deletecontact = function(req, res) {
    var id = req.params.id;
    console.log('Deleting contact: ' + id);
    db.collection('contacts', function(err, collection) {
        collection.remove({'_id': new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send(400, {'error': 'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
}

/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDB = function() {

    var contacts = [
    {
        name: "Dheeraj Kumar Aggarwal",
        email: "dheeraj.aggarwal@optimizory.com",
        designation: "Sr. Software Engineer",
        company: "Optimizory Technologies Pvt. Ltd.",
        country: "India",
        aboutMe: "About me Section ...",
        github: "https://github.com/dheerajaggarwal",
        facebook: "https://www.facebook.com/dheeraj.aggarwal",
        twitter: "https://www.twitter.com/dheeraj.aggarwal"
    },
    {
        name: "Ramesh Kumar",
        email: "ramesh.kumar@optimizory.com",
        designation: "Software Engineer",
        company: "Optimizory Technologies Pvt. Ltd.",
        country: "India",
        aboutMe: "About me Section ...",
        github: "https://github.com/dheerajaggarwal",
        facebook: "https://www.facebook.com/dheeraj.aggarwal",
        twitter: "https://www.twitter.com/dheeraj.aggarwal"
    },
    {
        name: "Deepanshu Natani",
        email: "deepanshu.natani@optimizory.com",
        designation: "Software Engineer",
        company: "Optimizory Technologies Pvt. Ltd.",
        country: "India",
        aboutMe: "About me Section ...",
        github: "https://github.com/dheerajaggarwal",
        facebook: "https://www.facebook.com/dheeraj.aggarwal",
        twitter: "https://www.twitter.com/dheeraj.aggarwal"
    },
    {
        name: "Deepak Jangid",
        email: "deepak.jangid@optimizory.com",
        designation: "Sr. Software Engineer",
        company: "Optimizory Technologies Pvt. Ltd.",
        country: "India",
        aboutMe: "About me Section ...",
        github: "https://github.com/dheerajaggarwal",
        facebook: "https://www.facebook.com/dheeraj.aggarwal",
        twitter: "https://www.twitter.com/dheeraj.aggarwal"
    }];

    db.collection('contacts', function(err, collection) {
        collection.insert(contacts, {safe:true}, function(err, result) {});
    });

};