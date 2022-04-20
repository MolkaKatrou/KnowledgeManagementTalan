const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const UserModel = new Schema ({
    lastname: {type: String, required: true},
    firstname: {type: String, required: true},
    email: {type: String, required: true},
    username : {type: String, required: true},
    password : {type: String, required: true},
    occupation: {type: String, required: true},
    phone: {type: String, required: true},
    role: {type: String},
    resetToken : String,
    expireToken: Date
}, {timestamps: true})

module.exports = mongoose.model('users', UserModel)
