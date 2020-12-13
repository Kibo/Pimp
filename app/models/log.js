var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Log Schema
 */
var LogSchema = new Schema({ 	
	status:Number,
	user:String,
	message:String,
	iss:String,
	created: { type: Date, default: Date.now }    
})

module.exports = mongoose.model('Log', LogSchema)