var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Page Schema
 */
var LogSchema = new Schema({ 	
	status:Number,
	user:String,
	message:String,
	created: { type: Date, default: Date.now }    
})

/**
 * Virtuals
 */
  
/**
 * Validations
 */

/**
 * Methods
 */
LogSchema.methods = {
	
	
}

module.exports = mongoose.model('Log', LogSchema)