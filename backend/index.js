const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport=require('passport');

require('dotenv').config();

const RouterUsers = require('./Routes/users.route.js');
const RouterCategories = require('./Routes/categories.route.js');
const RouterNotes = require('./Routes/notes.route.js');
const RouterQuestions = require('./Routes/questions.route.js');
const RouterChat = require('./Routes/chat.route.js');
const RouterMessages = require('./Routes/messages.route.js');


const app = express();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "frontend", "build")));
  app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, "frontend", "build", "index.html"))
  });
  console.log("Running production");
} else {
  app.get('/', (req, res) => {
      res.send("Server is working..")
  });
}
 
app.use(express.json());
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));
app.use('./frontend/public', express.static('uploads'));




/*passport*/
app.use(passport.initialize());

const URI = process.env.ATLAS_URI

mongoose.connect(URI,
    err => {
        if(err) throw err;
        console.log('connected to MongoDB')
    });
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})


app.use('/Api', RouterUsers);
app.use('/Api', RouterCategories);
app.use('/Api', RouterNotes);
app.use('/Api', RouterQuestions);
app.use("/Api/message", RouterMessages);
app.use("/Api/chat", RouterChat);


const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
    console.log (`Server is running on port ${PORT} .`);
});

const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
      origin: "http://localhost:3000",
      // credentials: true,
    },
  });

  const users = {};

  io.on("connection", (socket)=> {
      console.log('connected to socket.io')

      socket.on('setup', (userData)=> {
          socket.join(userData.id)
          socket.emit("connected") 
          console.log( userData.fullname + ' connected to socket.io')

          users[socket.id] = userData;  
      })
 
      socket.on('getrooms', (replyFn)=>{
            replyFn(users)
    })

      socket.on('join chat' , (room) => {
          socket.join(room);
          console.log("User Joined Room: " + room);      
      })  

      socket.on("typing", (room) => socket.in(room).emit("typing"));

      socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));    

      socket.on('new message', (newMessageReceived)=>{
          var chat = newMessageReceived.chat
          if (!chat.users) return console.log('chat.users not defined')
          chat.users.forEach((user)=>{
              if(user._id == newMessageReceived.sender._id) return;
              socket.in(user._id).emit("message received", newMessageReceived)
          })
      })

      socket.on("sendNotification", ({ sender, receiver, type, postId, post }) => {
        if(sender.id === receiver._id) return;
        socket.in(receiver._id).emit("getNotification", {
          sender,
          type,
          postId,
          post
        });
      });
    
      socket.on('disconnect', function(){
        console.log('user ' + users[socket.id] + ' disconnected');
        delete users[socket.id];
      });

    })

 
  