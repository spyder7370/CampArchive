var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");


var UserSchema = new mongoose.Schema({

    username: String,

    password: String,

    avatar: {
        type: String,
        default: "https://i.imgur.com/710zC3Z.png"
    },
    firstName: String,
    lastName: String,
    email: String,
    about: {
        type: String,
        default: "Nice to meet you, I am new to Camp Archive."
    },

    isAdmin: {
        type: Boolean,
        default: false
    }
    
});


UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", UserSchema);