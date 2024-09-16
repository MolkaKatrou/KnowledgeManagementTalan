const noteModel = require("../models/notes.model");
const commentModel = require("../models/comment.model");
const { ValidateNote } = require("../Validation/notes.validation");
const QuestionModel = require("../models/questions.model");


const multer = require("multer");
const path = require("path");



const filesStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads");
    },
    filename: (req, file, cb) => {
        cb(null, `${file.originalname}`);
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        if (ext !== '.jpg' && ext !== '.png' && ext !== '.mp4') {
            return cb(res.status(400).end('only jpg, png, mp4 is allowed'), false);
        }
        cb(null, true)
    }
});

const filesStorageB = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./../frontend/public");
    },
    filename: (req, file, cb) => {
        cb(null, `${file.originalname}`);
    },
});

const upload = multer({ storage: filesStorage }).single('file');
const uploadB = multer({ storage: filesStorageB }).single('file');


const Getnotes = async (req, res) => {
    try {
        const note = await noteModel.find().populate('createdby').populate('category').populate({
            path: 'comments',
            model:'comment',
            populate: {
              path: 'user',
              model: 'user'
            }
          }).sort({date: 1});
        res.status(201).json(note);
    } catch (error) {
        console.log(error.message);
    }
}

const GetAll = async (req, res) => {
    try {
        const notes = await noteModel.find().populate('createdby').populate('category').populate({
            path: 'comments',
            model:'comment',
            populate: {
              path: 'user',
              model: 'user'
            }
          }).sort({date: 1});
          const questions = await QuestionModel.find().populate('category').populate('createdby');
          const all = notes.concat(questions)
        res.status(201).json(all);
    } catch (error) {
        console.log(error.message);
    }
}

const Addnote = async (req, res) => {
    req.body.createdAt = new Date().toISOString()
    req.body.updated_At = new Date().toISOString()
    try {
      
            const note = new noteModel(req.body)
            await note.save();
            res.status(201).json(note);
      
    }   
    catch (error) {
        console.log(error.message);
        }
}

const Commentnote = async (req, res) => {
    const {id} = req.params;
    const newComment = new commentModel ({
        user: req.body.user,
        comment: req.body.comment,
        parentId : req.body.parentId,
        createdAt: new Date().toISOString()
    })

    const note = await noteModel.findById(id);
    if (!Array.isArray(note.comments)) {
        note.comments = [];
    }
    note.comments.push(newComment);
    newComment.save()
    const updatedNote = await noteModel.findByIdAndUpdate(id, note, { new: true }).populate({
        path: 'comments',
        model:'comment',
        populate: {
          path: 'user',
          model: 'user'
        }
      })
    res.status(201).json(updatedNote); 
};

const getPostsBySearch = async (req, res) => {
    const { searchQuery } = req.query;
    try {
        const title = new RegExp(searchQuery, "i");
        const content = new RegExp(searchQuery, "i");
        const body = new RegExp(searchQuery, "i");

        const posts = await noteModel.find({$or: [{title},{content}]}).populate('category').populate('createdby');
        const questions = await QuestionModel.find({  $or: [{title}, {body}]}).populate('category').populate('createdby');
        const all = posts.concat(questions)
        res.status(201).json(all);
    } catch (error) {    
        res.status(404).json({ message: error.message });
    }
}

const likePost = async (req, res) => {
    const { id } = req.params;

    if (!req.userId) {
        return res.json({ message: "Unauthenticated" });
      }
    
    const note = await noteModel.findById(id);
    const index = note.likes.findIndex((id) => id ===String(req.userId));

    if (index === -1) {
      note.likes.push(req.userId);
    } else {
      note.likes = note.likes.filter((id) => id !== String(req.userId));
    }

    const updatedPost = await noteModel.findByIdAndUpdate(id, note, { new: true });

    res.status(201).json(updatedPost);
   
}

const BookmarkPost = async (req, res) => {
    const { id } = req.params;

    if (!req.userId) {
        return res.json({ message: "Unauthenticated" });
      }
    
    const note = await noteModel.findById(id);
    const index = note.bookmarks.findIndex((id) => id ===String(req.userId));

    if (index === -1) {
      note.bookmarks.push(req.userId);
    } else {
      note.bookmarks = note.bookmarks.filter((id) => id !== String(req.userId));
    }

    const updatedPost = await noteModel.findByIdAndUpdate(id, note, { new: true });

    res.status(200).json(updatedPost);
   
}


const Deletenote = async (req, res) => {
    const { id } = req.params;
    await noteModel.findByIdAndRemove(id);
    res.json({ message: "Post deleted successfully." });
};
const DeleteComment = async (req, res) => {
    const { id } = req.params;
    await commentModel.findByIdAndRemove(id);
    await commentModel.deleteMany({ parentId: id })
    res.json({ message: "Comment deleted successfully." });
};

const UpdateComment = async (req, res) => {
    const { id } = req.params;
    const { comment } = req.body;
    const updatedComment = { comment, _id: id };
    await commentModel.findByIdAndUpdate(id, updatedComment, { new: true });
    res.json(updatedComment);
}


const Updatenote = async (req, res) => {
    const { id } = req.params;
    req.body.updated_At = new Date().toISOString()
    const updated_At = req.body.updated_At
    const { title, category, content, isDraft} = req.body;
    const updatedPost = { category, title, content,isDraft,updated_At, _id: id };
    await noteModel.findByIdAndUpdate(id, updatedPost, { new: true });
    res.json(updatedPost);
}

const Uploadfiles = (req, res) => {
    upload(req, res, err => {
        if (err) {
            return res.json({ success: false, err });
        }
        return res.json({ success: true, url: res.req.file.path, fileName: res.req.file.filename });
    });
}
const GetSinglenote = async (req, res) => { 
    const { id } = req.params;
    try {
        const post = await noteModel.findById(id).populate('createdby').populate('category').populate({
            path: 'comments',
            model:'comment',
            populate: {
              path: 'user',
              model: 'user'
            }
          });       
          
        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}


module.exports = {
    GetSinglenote,
    Getnotes,
    Deletenote,
    Addnote,
    Updatenote,
    Uploadfiles,
    Commentnote,
    likePost,
    BookmarkPost,
    getPostsBySearch,
    GetAll,
    DeleteComment,
    UpdateComment
};
