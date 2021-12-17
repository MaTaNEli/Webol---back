const mongoose = require('mongoose');

require('dotenv').config();

/**
 * -------------- DATABASE ----------------
 */

/**
 * Connect to MongoDB Server using the connection string in the `.env` file.  To implement this, place the following
 * string into the `.env` file
 * 
 * DB_STRING=mongodb://<user>:<password>@localhost:27017/database_name
 */ 

const conn = process.env.DB_STRING;

const connection = mongoose.createConnection(conn, {
    useNewUrlParser: true,
    useUnifiedTopology: true
},() =>console.log("Connected to DB"));

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
    full_name:{
        type: String,
        required:true
    },
    logedin:{
        type: Boolean
    }
});


const User = connection.model('User', UserSchema);

// // Expose the connection
module.exports = connection;
