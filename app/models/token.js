var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Token Schema
 */
var TokenSchema = new Schema({ 	
		
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
  		type: String,
  		require: true,
  		unique: true,
  	},
  	
  	// the secret to sign the JWT token
  	secret:{
    	type: String,    
    	require: true
  	},
  	
  	//the number of seconds the token will be valid
	exp: { 
		type: Number,
		require: true,
		default:60*60		
	}  		   	  
})


TokenSchema.path('iss').validate(function ( iss ) { 	
  	return iss.length
}, 'Iss cannot be blank.')

TokenSchema.path('iss').validate( function( iss ){	
	var Token = mongoose.model('Token')
	  	   
  	if (this.isNew || this.isModified('iss')) {  			
  			return new Promise(function(resolve, reject){  				
  				Token.find({ iss: iss }).exec(function (err, tokens) {
      				if(!err && tokens.length === 0){
      					resolve (true)
      				}
    				reject( Error('Iss already exists.') );    			
    			})  				  							 	  		  		 			
			})  						    			   
  	} else{
  		return true;
  	}
		
}, 'Iss already exists.')

module.exports = mongoose.model('Token', TokenSchema)