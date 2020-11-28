var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Page Schema
 */
var FormSchema = new Schema({ 
  
  name:{
    type: String,
    require: true      
  },
  
  firstname:{
    type: String    
  },
  
  lastname:{
    type: String      
  },
  
  email:{
    type: String,
    require: true,    
    lowercase: true       
  },
  
  phone:{
    type: String      
  },
  
  company:{
    type: String      
  },
  
  street:{
    type: String      
  },
  
  city:{
    type: String      
  },
  
  zip:{
    type: String      
  },
  
  ic:{
    type: String      
  },
  
  dic:{
    type: String      
  },
  
  participation:{
    type: String      
  },
  
  note:{
    type: String      
  },
  
  created: { type: Date, default: Date.now }
       
})

/**
 * Virtuals
 */
  
/**
 * Validations
 */
FormSchema.path('name').validate(function (name) { 	
  	return name.length
}, 'Form name cannot be blank.')

FormSchema.path('email').validate(function (email) { 	
  	return email.length
}, 'Email musí být vyplněn.')


/**
 * Methods
 */
FormSchema.methods = {
		
}

module.exports = mongoose.model('Form', FormSchema)