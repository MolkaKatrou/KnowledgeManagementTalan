const mongoose = require("mongoose");

const messageModel = mongoose.Schema({
    sender: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "user" 
    },
    content: {
         type: String, 
         trim: true 
        },
    file: {
        type: String,
        default: ""
    },

    chat: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "chat" 
    },
    readBy: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "user" 
    }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Message', messageModel)
