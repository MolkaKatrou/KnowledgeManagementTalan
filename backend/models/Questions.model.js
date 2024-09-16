const mongoose = require("mongoose");
const Schema = mongoose.Schema; 

const QuestionModel = new mongoose.Schema({
    createdby:{
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    category:{
        type: Schema.Types.ObjectId, 
        ref: 'category'
    },
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    upVotes: { 
        type: [String], 
        default: [] 
    }, 
    downVotes: { 
        type: [String], 
        default: [] 
    }, 
    bookmarks: { 
        type: [String], 
        default: [] 
    },

    createdAt: {
        type: Date,
        default: Date.now(),
    },

    updated_At : {
        type: Date,
    },
}, {timestamps: true});

module.exports = mongoose.model("question", QuestionModel);