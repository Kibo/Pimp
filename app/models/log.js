var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Log Schema
 */
var LogSchema = new Schema({ 	
	status:Number,
	user:String,	
	iss:String,
	method:String,
	url:String,
	message:String,
	created: { type: Date, default: Date.now }    
})

module.exports = mongoose.model('Log', LogSchema)