const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const categoryModel = new Schema ({
    createdby:{
        type: Schema.Types.ObjectId,
        ref: 'user'
    },      
    name: {
        type: String, 
        required: true,
    },
    slug: {
        type: String, 
        required: true,
    },
    parentId: {
        type: String,      
    },

    color:{
        type:String,
    },

    followers: { 
        type: [String], 
        default: [] 
    },
    createdAt: {
        type: Date,
    },
 
}, {timestamps: true})

module.exports = mongoose.model('category', categoryModel)
