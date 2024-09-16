const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const commentModel = new Schema ({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    comment:{
        type:String,
    }, 
    createdAt: {
        type: Date,
        default: Date.now(),
    },

    parentId: {
        type: String, 
        default:null,     
    },
 
}, {timestamps: true})

module.exports = mongoose.model('comment', commentModel)
