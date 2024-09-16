const mongoose = require("mongoose");

const chatModel = mongoose.Schema({
    chatName: { 
        type: String, 
        trim: true 
    },
    isGroupChat: { 
        type: Boolean, 
        default: false 
    },
    users: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "user" ,
        default : null
    }],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    groupAdmin: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "user",
        default : null
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('chat', chatModel)


