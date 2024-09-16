const express = require('express');
const {GetQuestions, AddQuestion, GetSingleQuestion,BookmarkQuestion, DeleteQuestion,DeleteComment, VoteUp, VoteDown,CommentAnswer,GetAnswers,VoteUpAnswer,VoteDownAnswer, AddAnswer, DeleteAnswer, updateQuestion, updateAnswer }= require('../controllers/questions.controllers');
const { auth } = require('../security/auth');
const router = express.Router();


router.get('/questions',auth, GetQuestions)
router.get('/questions/:id',auth, GetSingleQuestion)
router.post('/questions',auth, AddQuestion)
router.delete('/questions/:id',auth, DeleteQuestion)
router.patch('/questions/:id/voteup', auth, VoteUp);
router.patch('/questions/:id/votedown', auth, VoteDown);
router.patch('/questions/:id/bookmark', auth, BookmarkQuestion);
router.patch('/questions/:id',auth, updateQuestion)


router.get('/answers',auth, GetAnswers)
router.post('/answers',auth, AddAnswer)
router.delete('/answers/:id',auth, DeleteAnswer)
router.patch('/answers/:id/voteup', auth, VoteUpAnswer);
router.patch('/answers/:id/votedown', auth, VoteDownAnswer);
router.post('/answers/:id/comment',auth, CommentAnswer) 
router.delete('/answers/:id/comment/:id',auth, DeleteComment)
router.patch('/answers/:id',auth, updateAnswer)





module.exports = router;