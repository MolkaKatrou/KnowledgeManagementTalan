const express = require('express');
const {Getnotes, Addnote, getPostsBySearch, likePost,GetAll, BookmarkPost, Updatenote, Deletenote, Uploadfiles, Commentnote, GetSinglenote, DeleteComment, UpdateComment }= require('../controllers/notes.controllers');
const { auth } = require('../security/auth');
const router = express.Router();


router.get('/notes',auth, Getnotes)
router.get('/notesQuestions',auth, GetAll)
router.get('/notes/:id',auth, GetSinglenote)
router.get('/search',auth, getPostsBySearch)
router.post('/notes',auth, Addnote)
router.delete('/notes/:id',auth, Deletenote)
router.post('/notes/:id/comment',auth, Commentnote) 
router.patch('/notes/:id/like', auth, likePost);
router.patch('/notes/:id/bookmark', auth, BookmarkPost);
router.patch('/notes/:id',auth, Updatenote);
router.post('/uploadfiles',auth, Uploadfiles);
router.delete('/notes/:id/comment/:id',auth, DeleteComment)
router.patch('/notes/comment/:id',auth, UpdateComment)


module.exports = router;