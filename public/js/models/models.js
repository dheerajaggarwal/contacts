window.Contact = Backbone.Model.extend({

    urlRoot: "/contacts",

    idAttribute: "_id",

    initialize: function () {
        this.validators = {};

        this.validators.name = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter a name"};
        };
    },

    validateItem: function (key) {
        return (this.validators[key]) ? this.validators[key](this.get(key)) : {isValid: true};
    },

    // TODO: Implement Backbone's standard validate() method instead.
    validateAll: function () {

        /*var messages = {};

        for (var key in this.validators) {
            if(this.validators.hasOwnProperty(key)) {
                var check = this.validators[key](this.get(key));
                if (check.isValid === false) {
                    messages[key] = check.message;
                }
            }
        }

        return _.size(messages) > 0 ? {isValid: false, messages: messages} : {isValid: true};
        */
        return {isValid: true};
    },

    defaults: {
        _id: null,
        name: "",
        email: "",
        designation: "",
        organization: "",
        country: "",
        aboutMe: "",
        twitter: "",
        facebook: "",
        github: ""
    }
});

window.ContactCollection = Backbone.Collection.extend({

    model: Contact,

    url: "/contacts"

});