const jwt = require("jsonwebtoken");
const UserModel = require("../models/users.model");
const { ValidateLogin } = require("../Validation/users.validation");

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    let decodedData;

    if (token) {      
      decodedData = jwt.verify(token, process.env.PRIVATE_KEY);
      req.user = await UserModel.findById(decodedData?.id);
      req.userId = decodedData?.id;
    }    

    next();
  } catch (error) {
    console.log(error);
  }
};

const Verify = async (req, res, next) => {
  const { errors, isValid } = ValidateLogin(req.body)
  try {
    if (!isValid) {
      res.status(404).json(errors)
    }
    else{
    const user = await UserModel.findOne({email : req.body.email})
    if (!user){
      errors.email = 'this user does not exist'
      res.status(404).json(errors) 
    }
    if(user.isVerified){
      next()
    }
    else{ 
      errors.isVerified = "Please check your email to verify your account!"
      errors.email = "Please check your email to verify your account!"
      res.status(404).json(errors)  
    }
  }
    
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
    auth, Verify
}