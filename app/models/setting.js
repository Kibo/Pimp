var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Page Schema
 */
var SettingSchema = new Schema({ 	
	//TODO
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
SettingSchema.methods = {
	
}

module.exports = mongoose.model('Setting', LogSchema)