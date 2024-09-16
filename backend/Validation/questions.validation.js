const isEmpty = require('./IsEmpty');
const validator = require('validator');

function ValidateQuestion(data){
    let errors ={};
    
    data.category = !isEmpty(data.category) ? data.category :"";
    data.title = !isEmpty(data.title) ? data.title : "";
    data.body = !isEmpty(data.body) ? data.body :"";
    
    if (validator.isEmpty(data.category)){
        errors.category ="Please Choose the category";        
    }

    if (validator.isEmpty(data.title)){
        errors.title ="Please enter the title";
        
    }
    if (validator.isEmpty(data.body)){
        errors.body ="Please ask the question before submitting it";        
    }


    return {
        errors,
        isValid: isEmpty(errors),
        
    }
}


module.exports = {
    ValidateQuestion
  };