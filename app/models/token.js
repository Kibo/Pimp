var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Token Schema
 */
var TokenSchema = new Schema({ 	
	
	// token creation time
	iat:{
		type: Date, 
		default: Date.now 
	},
	
	// algorithm for secret sign
	alg:{ 
    	type: String,    
    	require: true,
    	default:"HS256"      
  	},
  	
  	isActive:Boolean,
  	  	  
  	// A string containing the name or identifier of the issuer application. 
  	//Can be a domain name and can be used to discard tokens from other applications.
  	iss:{   		
  		type: String
  	},
  	
  	// the secret to sign the JWT token
  	accessTokenSecret:{
    	type: String,    
    	require: true
  	},
  		   
	// the number of units(sec, mins, hours) the token will be valid
	exp: { 
		type: Number,
		require: true 		
	}    
})

module.exports = mongoose.model('Token', TokenSchema)