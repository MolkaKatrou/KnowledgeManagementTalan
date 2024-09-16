const QuestionModel = require("../models/questions.model");
const AnswerModel = require("../models/answers.model");
const commentModel = require("../models/comment.model");


const { ValidateQuestion } = require("../Validation/questions.validation");


const GetQuestions = async (req, res) => {
    try {
        const data = await QuestionModel.find().populate('category').populate('createdby').sort({date: 1});
        res.status(201).json(data);
    } catch (error) {
        console.log(error.message);
    }
}

const AddQuestion = async (req, res) => {
    req.body.createdAt = new Date().toISOString()
    req.body.updated_At = new Date().toISOString()
    const { errors, isValid } = ValidateQuestion(req.body)
    try {
        if (!isValid) {
            res.status(404).json(errors);
        } else {
            const question = new QuestionModel(req.body)
            await question.save();
            res.status(201).json(question);
        }
    }
    catch (error) {
        res.status(409).json({ message: error.message });
    }
}


const DeleteQuestion = async (req, res) => {
    const { id } = req.params;
    await QuestionModel.findByIdAndRemove(id);
    await AnswerModel.deleteMany({question : id})
    res.json({ message: "Question deleted successfully." });
};
const DeleteComment = async (req, res) => {
    const { id } = req.params;
    await commentModel.findByIdAndRemove(id);
    res.json({ message: "Comment deleted successfully." });
};


const GetSingleQuestion = async (req, res) => {
    const { id } = req.params;
    try {
        const question = await QuestionModel.findById(id).populate('createdby').populate('category')

        res.status(200).json(question);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const VoteUp = async (req, res) => {
    const { id } = req.params;
    if (!req.userId) {
        return res.json({ message: "Unauthenticated" });
    }
    const question = await QuestionModel.findById(id);
    const indexUp = question.upVotes.findIndex((id) => id === String(req.userId));
    const indexDown = question.downVotes.findIndex((id) => id === String(req.userId));

    if (indexUp === -1 || indexDown !== -1) {
        question.upVotes.push(req.userId);
        question.downVotes = question.downVotes.filter((id) => id !== String(req.userId));
        
    } else {
        question.upVotes = question.upVotes.filter((id) => id !== String(req.userId));      
    }
   
    const updatedQuestion = await QuestionModel.findByIdAndUpdate(id, question, { new: true });

    res.status(201).json(updatedQuestion);

}

const VoteDown = async (req, res) => {
    const { id } = req.params;
    if (!req.userId) {
        return res.json({ message: "Unauthenticated" });
    }
    const question = await QuestionModel.findById(id);
    const indexUp = question.upVotes.findIndex((id) => id === String(req.userId));
    const indexDown = question.downVotes.findIndex((id) => id === String(req.userId));

    if (indexDown === -1 || indexUp !== -1) {
        question.downVotes.push(req.userId);
        question.upVotes = question.upVotes.filter((id) => id !== String(req.userId));
        
    }
     else {
        question.downVotes = question.downVotes.filter((id) => id !== String(req.userId));
        
    }

  
    const updatedQuestion = await QuestionModel.findByIdAndUpdate(id, question, { new: true });

    res.status(201).json(updatedQuestion);
}

const BookmarkQuestion = async (req, res) => {
    const { id } = req.params;

    if (!req.userId) {
        return res.json({ message: "Unauthenticated" });
      }
    
    const question = await QuestionModel.findById(id);
    const index = question.bookmarks.findIndex((id) => id ===String(req.userId));

    if (index === -1) {
      question.bookmarks.push(req.userId);
    } else {
      question.bookmarks = question.bookmarks.filter((id) => id !== String(req.userId));
    }

    const updatedQuestion = await QuestionModel.findByIdAndUpdate(id, question, { new: true });

    res.status(200).json(updatedQuestion);
   
}

const updateQuestion = async (req, res) => {
    const { id } = req.params;
    req.body.updated_At = new Date().toISOString()
    const updated_At = req.body.updated_At
    const { title, category, body } = req.body;
    const updatedQuestion = { category, title, body,updated_At, _id: id };

    await QuestionModel.findByIdAndUpdate(id, updatedQuestion, { new: true });
    res.json(updatedQuestion);
}

const updateAnswer = async (req, res) => {
    const { id } = req.params;
    req.body.updated_At = new Date().toISOString()
    const updated_At = req.body.updated_At
    const {body} = req.body
    const updatedAnswer = { body, updated_At, _id: id };

    await AnswerModel.findByIdAndUpdate(id, updatedAnswer , { new: true });
    res.json(updatedAnswer);
}
const GetAnswers = async (req, res) => {
    try {
        const data = await AnswerModel.find().populate('question').populate('createdby').populate({
            path: 'comments',
            model:'comment',
            populate: {
              path: 'user',
              model: 'user'
            }
          });       
          
        res.status(201).json(data);
    } catch (error) {
        console.log(error.message);
    }
}

const AddAnswer = async (req, res) => {
    req.body.createdAt = new Date().toISOString()
    req.body.updated_At = new Date().toISOString()
    try {
            const answer = new AnswerModel(req.body)
            await answer.save();
            res.status(201).json(answer);   
        }
    catch (error) {
        res.status(409).json({ message: error.message });
    }
}

const DeleteAnswer = async (req, res) => {
    const { id } = req.params;
    await AnswerModel.findByIdAndRemove(id);
    res.json({ message: "Answer deleted successfully." });
};

const VoteUpAnswer = async (req, res) => {
    const { id } = req.params;
    if (!req.userId) {
        return res.json({ message: "Unauthenticated" });
    }
    const answer = await AnswerModel.findById(id);
    const indexUp = answer.upVotes.findIndex((id) => id === String(req.userId));
    const indexDown = answer.downVotes.findIndex((id) => id === String(req.userId));

    if (indexUp === -1 || indexDown !== -1) {
        answer.upVotes.push(req.userId);
        answer.downVotes = answer.downVotes.filter((id) => id !== String(req.userId));
      
    } else {
        answer.upVotes = answer.upVotes.filter((id) => id !== String(req.userId));
        
    }

    const updatedAnswer = await AnswerModel.findByIdAndUpdate(id, answer, { new: true });

    res.status(201).json(updatedAnswer );

}

const VoteDownAnswer = async (req, res) => {
    const { id } = req.params;
    if (!req.userId) {
        return res.json({ message: "Unauthenticated" });
    }
    const answer = await AnswerModel.findById(id);
    const indexUp = answer.upVotes.findIndex((id) => id === String(req.userId));
    const indexDown = answer.downVotes.findIndex((id) => id === String(req.userId));

    if (indexDown === -1 || indexUp !== -1) {
        answer.downVotes.push(req.userId);
        answer.upVotes = answer.UpVotes.filter((id) => id !== String(req.userId));
        
    }
     else {
        answer.downVotes = answer.downVotes.filter((id) => id !== String(req.userId));
        
    }

    const updatedAnswer  = await AnswerModel.findByIdAndUpdate(id, answer, { new: true });

    res.status(201).json(updatedAnswer );
}

const CommentAnswer = async (req, res) => {
    const {id} = req.params;
    const newComment = new commentModel ({
        user: req.body.user,
        comment: req.body.comment,
        createdAt: new Date().toISOString()
    })

    const answer = await AnswerModel.findById(id);
    if (!Array.isArray(answer.comments)) {
        answer.comments = [];
    }
    answer.comments.push(newComment);
    newComment.save()
    const updatedAnswer = await AnswerModel.findByIdAndUpdate(id, answer, { new: true }) .populate({
        path: 'comments',
        model:'comment',
        populate: {
          path: 'user',
          model: 'user'
        }
      })
    res.status(201).json(updatedAnswer); 
};



module.exports = {
    GetSingleQuestion,
    GetQuestions,
    DeleteQuestion,
    AddQuestion,
    VoteUp,
    VoteDown,
    GetAnswers,
    AddAnswer,
    DeleteAnswer,
    VoteUpAnswer,
    VoteDownAnswer,
    CommentAnswer,
    DeleteComment,
    BookmarkQuestion,
    updateQuestion,
    updateAnswer
};
