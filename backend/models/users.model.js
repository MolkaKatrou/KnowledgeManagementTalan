const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const UserModel = new Schema ({
    lastname: {type: String, required: true},
    firstname: {type: String, required: true},
    fullname :{type: String, default:''}, 
    email: {type: String, required: true},
    username : {type: String, required: true},
    password : {type: String, required: true},
    occupation: {type: String, required: true},
    adress: {type: String, required: true},
    phone: {type: String, required: true},
    role: {type: String},
    isVerified : {type: Boolean , default:false},
    pic: {
        type: String,
        default: "",
      },
    resetToken : String,
    expireToken: Date
}, {timestamps: true})



module.exports = mongoose.model('user', UserModel)
