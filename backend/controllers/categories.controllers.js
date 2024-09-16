const slugify = require("slugify");

const noteModel = require("../models/notes.model");
const categoryModel = require("../models/categories.model");
const QuestionModel = require("../models/questions.model");
const messageModel = require("../models/message.model");

const { ValidateCategory } = require("../Validation/categories.validation");
var mongoose = require('mongoose');
const isEmpty = require("../Validation/IsEmpty");
var Id = mongoose.Types.ObjectId('569ed8269353e9f4c51617aa')



function createCategories(categories, parentId = null) {
  const categoryList = [];
  let category;
  if (parentId == "" || parentId == null) {
    category = categories.filter(cat => cat.parentId == "")
  } else {
    category = categories.filter(cat => cat.parentId == parentId)
  }
  for (let cat of category) {
    categoryList.push({
      createdby:cat.createdby,
      _id: cat._id,
      name: cat.name,
      slug: cat.slug,
      color: cat.color,
      parentId: cat.parentId,
      followers: cat.followers,
      createdAt:cat.createdAt,
      children: createCategories(categories, cat._id)
    })

  }
  return categoryList;
}

const Addcategory = async (req, res) => {
  const { errors, isValid } = ValidateCategory(req.body)
  try {
    if (!isValid) {
      res.status(404).json(errors);
    } else {     
      req.body.createdAt = new Date().toISOString()
      await categoryModel.findOne({ name: req.body.name })
        .then(async (exist) => {
          if (exist) {
            return res.status(400).send("The category already exist");
          } else {
            const categoryObj = {
              createdby: req.userId,
              name: req.body.name,
              slug: slugify(req.body.name),
              color: req.body.color,
              parentId: req.body.parentId,
              createdAt : req.body.createdAt
            }
      
            if (!isEmpty(req.body.parentId)) {
              categoryObj.parentId = req.body.parentId
            }
            
            const category = new categoryModel(categoryObj)
            await category.save();
            res.status(201).json(category);
          }
        })
    }
  }
  catch (error) {
    return res.status(404).json({ message: error.message });
  }
}

const Getcategories = async (req, res) => {
  //await messageModel.deleteMany({})
  try {
    const categories = await categoryModel.find().populate('createdby');
    const categoryList = createCategories(categories)
    res.status(201).json(categoryList);
  } catch (error) {
    console.log(error.message);
  }

}


const Deletecategory = async (req, res) => {
  const { ids } = req.body.payload;
  const deletedCategories = [];
  for (let i = 0; i < ids.length; i++) {
    const deleteCategory = await categoryModel.findOneAndDelete({
      _id: ids[i]._id,
    });
    deletedCategories.push(deleteCategory);
  }

  if (deletedCategories.length == ids.length) {
    res.status(201).json({ message: "Categories removed" });
  } else {
    res.status(400).json({ message: "Something went wrong" });
  }
};

const Delete = async (req, res) => {
  try {
    await categoryModel.findOneAndDelete({ _id: req.params.id });
    await categoryModel.deleteMany({ parentId: req.params.id });
    await noteModel.deleteMany({ category: req.params.id })
    await QuestionModel.deleteMany({ category: req.params.id })
    res.status(201).json({ message: "Category deleted with success!" });
  } catch (error) {
    console.log(error.message);
  }
};

const DeleteAndUpdateNotes = async (req, res) => {
  try {
    await categoryModel.findOneAndDelete({ _id: req.params.id });
    noteModel.find({ category: req.params.id }, function (err, docs) {

    });
    noteModel.find().forEach(function (doc) {
      doc.category = ObjectId("4c8a331bda76c559ef000004");
      noteModel.create(doc)
    });

    //await noteModel.deleteMany({ category: req.params.id })

    //const update = { category:  };
    //let note = await noteModel.findOneAndUpdate(filter, update);
    //note = await noteModel.findOne(note);
    res.status(201).json({ message: "Category deleted with success!" });
  } catch (error) {
    console.log(error.message);
  }
};

const Update = async (req, res) => {
  try {
    const data = await categoryModel.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );
    res.status(201).json(data);

  } catch (error) {
    console.log(error.message);
  }
};

const Updatecategory = async (req, res) => {
  const { _id, name, parentId } = req.body;
  const updatedCategories = [];
  if (name instanceof Array) {
    for (let i = 0; i < name.length; i++) {
      const category = {
        name: name[i],
      };
      if (parentId[i] !== "") {
        category.parentId = parentId[i];
      }

      const updatedCategory = await categoryModel.findOneAndUpdate(
        { _id: _id[i] },
        category,
        { new: true }
      );
      updatedCategories.push(updatedCategory);
    }
    return res.status(201).json({ updateCategories: updatedCategories });
  } else {
    const category = {
      name,
    };
    if (parentId !== "") {
      category.parentId = parentId;
    }
    const updatedCategory = await categoryModel.findOneAndUpdate({ _id }, category, {
      new: true,
    });

    return res.status(201).json({ updatedCategory });
  }
}

const FollowCategory = async (req, res) => {
  const { id } = req.params;
  if (!req.userId) {
    return res.json({ message: "Unauthenticated" });
  }
  const category = await categoryModel.findById(id);
  const index = category.followers.findIndex((id) => id === String(req.userId));

  if (index === -1) {
    category.followers.push(req.userId);
  } else {
    category.followers = category.followers.filter((id) => id !== String(req.userId));
  }
  const updatedCategory = await categoryModel.findByIdAndUpdate(id, category, { new: true });

  res.status(200).json(updatedCategory);
}

const GetSinglecategory = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await categoryModel.findById(id);
    res.status(200).json(category);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

module.exports = {
  Getcategories,
  Deletecategory,
  Addcategory,
  GetSinglecategory,
  Updatecategory,
  Delete,
  Update,
  FollowCategory,
  DeleteAndUpdateNotes
};
