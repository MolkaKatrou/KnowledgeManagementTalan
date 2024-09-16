const isEmpty = require('./IsEmpty');
const validator = require('validator');

function ValidateNote(data){
    let errors ={};
    
    data.category = !isEmpty(data.category) ? data.category :"";
    data.title = !isEmpty(data.title) ? data.title : "";
    data.content = !isEmpty(data.content) ? data.content :"";
    
    if (validator.isEmpty(data.category)){
        errors.category ="Please Choose the category";        
    }

    if (validator.isEmpty(data.title)){
        errors.title ="Please enter the title";        
    }

    if (validator.isEmpty(data.content)){
        errors.content ="Please add your knowledge before submitting it";        
    }


    return {
        errors,
        isValid: isEmpty(errors),
        
    }
}


module.exports = {
    ValidateNote
  };