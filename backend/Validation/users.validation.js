const isEmpty = require('./IsEmpty');
const validator = require('validator');

function ValidateLogin(data){
    let errors ={};   
    data.email = !isEmpty(data.email) ? data.email : "";
    data.password = !isEmpty(data.password) ? data.password :"";


    if (!validator.isEmail(data.email)){
        errors.email ="The email format is incorrect. Please provide a correct one";
    }
    if (validator.isEmpty(data.email)){
        errors.email ="Please enter the email address";
        
    }
    if (validator.isEmpty(data.password)){
        errors.password ="Please enter the password";     
    }


    return {
        errors,
        isValid: isEmpty(errors),
        
    }
}
function ValidatePassword(data){
    let errors ={};
    data.password = !isEmpty(data.password) ? data.password :"";
    data.confirm = !isEmpty(data.confirm) ? data.confirm : "";
    
    if (!validator.isLength(data.password , {min:8})){
        errors.password ="The password should have at least 8 characters";
    }
    if (validator.isEmpty(data.password)){
        errors.password ="Please enter your password";
    }
    if (validator.isEmpty(data.confirm)){
        errors.confirm ="Please enter the password to confirm";
    }
    if(!validator.equals(data.password, data.confirm)){
        errors.confirm = "The passwords don't match";
    }


    return {
        errors,
        isValid: isEmpty(errors)
    }
}
function ValidateUser(data){
    let errors ={};
    data.email = !isEmpty(data.email) ? data.email : "";
    data.username = !isEmpty(data.username) ? data.username : "";
    //data.password = !isEmpty(data.password) ? data.password :"";
    data.occupation = !isEmpty(data.occupation) ? data.occupation : "";
    data.role = !isEmpty(data.role) ? data.role : "";
    data.firstname = !isEmpty(data.firstname) ? data.firstname : "";
    data.lastname = !isEmpty(data.lastname) ? data.lastname : "";
    data.phone = !isEmpty(data.phone) ? data.phone : "";
    data.adress = !isEmpty(data.adress) ? data.adress : "";


    if (!validator.isEmail(data.email)){
        errors.email ="The email format is incorrect. Please provide a correct one";
    }
    if (validator.isEmpty(data.email)){
        errors.email ="Please enter the email address";
    }
    if (validator.isEmpty(data.username)){
        errors.username ="Please enter the username";
    }

    if (validator.isEmpty(data.occupation)){
        errors.occupation ="Please choose the user's occupation at TALAN";
    }
    if (validator.isEmpty(data.lastname)){
        errors.lastname ="Please enter the last name";
    }
    if (validator.isEmpty(data.firstname)){
        errors.firstname ="Please enter the first name";
    }
    if (!validator.isLength(data.phone , {min:8, max: 8})){
        errors.phone ="The phone number should contain 8 numbers";
    }
    if (validator.isEmpty(data.phone)){
        errors.phone ="Please enter the user's phone number";
    }
    if (validator.isEmpty(data.role)){
        errors.role ="Please Choose the user's role";
    }
      if (validator.isEmpty(data.adress)){
        errors.adress ="Please Choose the user's home address";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}
function ValidateEmail(data){
    let errors ={};
    let success={};
    data.email = !isEmpty(data.email) ? data.email : "";
    if (!validator.isEmail(data.email)){
        errors.email ="The email format is incorrect. Please provide a correct one";
    }
    if (validator.isEmpty(data.email)){
        errors.email ="Please enter the email address";
    }

    success.email='ok'

    return {
        errors,
        success,
        isValid: isEmpty(errors)
    }
}

function ValidateChangePassword(data){
    let errors ={};
    data.old_password = !isEmpty(data.old_password) ? data.old_password :"";
    data.new_password = !isEmpty(data.new_password) ? data.new_password :"";
    data.confirm_password = !isEmpty(data.confirm_password) ? data.confirm_password : "";


    if (validator.isEmpty(data.old_password)){
        errors.old_password ="Please enter your old password";
    }
    if (validator.isEmpty(data.new_password)){
        errors.new_password ="Please enter your new password";
    }
    if (validator.isEmpty(data.confirm_password)){
        errors.confirm_password ="Please enter the password to confirm";
    }
    if(!validator.equals(data.new_password, data.confirm_password)){
        errors.confirm_password = "The passwords don't match";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}



module.exports = {
    ValidateUser,
    ValidateLogin,
    ValidatePassword,
    ValidateEmail,
    ValidateChangePassword
  };