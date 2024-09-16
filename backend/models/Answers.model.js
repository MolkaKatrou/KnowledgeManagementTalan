const mongoose = require("mongoose");
const Schema = mongoose.Schema; 

const AnswerModel = new mongoose.Schema({
    question :{
        type: Schema.Types.ObjectId,
        ref: 'question'
    },    
    createdby:{
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    body: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    updated_At : {
        type: Date,
    },
    upVotes: { 
        type: [String], 
        default: [] 
    }, 
    downVotes: { 
        type: [String], 
        default: [] 
    }, 
    comments: [{ 
        type: Schema.Types.ObjectId, 
        ref:'comment'  
    }],


});

module.exports = mongoose.model("answer", AnswerModel);