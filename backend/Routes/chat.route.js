const express = require('express');
const {accessChat, fetchChats, createGroupChat, renameGroup, removeFromGroup, addToGroup} = require('../controllers/chat.controllers');

const { auth } = require('../security/auth');
const router = express.Router();

router.post('/',auth, accessChat)
router.get("/" , auth, fetchChats);
router.post("/group", auth, createGroupChat);
router.put("/rename", auth, renameGroup);
router.put("/groupremove", auth, removeFromGroup);
router.put("/groupadd", auth, addToGroup);


module.exports = router;