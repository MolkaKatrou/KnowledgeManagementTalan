const isEmpty = require('./IsEmpty');
const validator = require('validator');

function ValidateCategory(data){
    let errors ={};
    
    data.name = !isEmpty(data.name) ? data.name :"";
    data.color = !isEmpty(data.color) ? data.color : "";
    
    if (validator.isEmpty(data.name)){
        errors.category ="Please Choose the category's name";        
    }

    if (validator.isEmpty(data.color)){
        errors.title ="Please the category's color";        
    }


    return {
        errors,
        isValid: isEmpty(errors),
        
    }
}


module.exports = {
    ValidateCategory
  };