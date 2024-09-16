const chatModel = require("../models/Chat.model");
const UserModel = require("../models/users.model");
const messageModel = require('../models/message.model');
const multer = require("multer");
const path = require("path");



const filesStorageB = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, "./../frontend/public");
  },
  filename: (req, file, cb) => {
      cb(null, `${file.originalname}`);
  },
});

const allMessages = async (req, res) => {
    try {
     
      const messages = await messageModel.find({ chat: req.params.chatId })
        .populate("sender", "fullname pic email")
        .populate({
            path: 'chat',
            model:'chat',
            populate: {
              path: 'users',
              select: "fullname pic email",
            }
          })
      res.json(messages);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }; 

  const sendMessage = async (req, res) => {
    const { content,file, chatId} = req.body;  
    if (!content || !chatId) {
      console.log("Invalid data passed into request");
      return res.sendStatus(400);
    }
  
    var newMessage = {
      sender: req.userId,
      content: content,
      chat: chatId,
      file:file,
    };
  
    try {
      var message = await messageModel.create(newMessage);
   
      message = await message.populate("sender", "fullname pic")
      message = await message.populate({
        path: 'chat',
        model:'chat',
        populate: {
          path: 'users',
          select: "fullname pic email",
        }
      })
      message = await UserModel.populate(message, {
        path: "chat.users",
        select: "fullname pic email",
      });
      await chatModel.findByIdAndUpdate(req.body.chatId, { latestMessage: message });
  
      res.json(message);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  };
  
  module.exports = { allMessages, sendMessage };