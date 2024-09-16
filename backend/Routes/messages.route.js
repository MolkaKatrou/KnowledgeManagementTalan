const {allMessages, sendMessage,} = require("../controllers/messages.controllers");
const express = require('express');
const { auth } = require('../security/auth');
const router = express.Router();


router.get("/:chatId" , auth, allMessages);
router.post("/", auth, sendMessage);


module.exports = router;