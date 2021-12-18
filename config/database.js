const mongoose = require('mongoose');

// Creates schema for a User
const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    password: {
        type:String,
        min: 6
    },
    email:{
        type: String,
        required:true,
        unique: true
    },
    fullname:{
        type: String,
        required:true
    }
});

// // Expose the connection
module.exports = mongoose.model('User', UserSchema)
