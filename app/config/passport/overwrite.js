var config = require('../config');
var mongoose = require('mongoose');
var Token = mongoose.model('Token');
var User = mongoose.model('User');
const jwt = require('jsonwebtoken');


/**
 * Check is user is authenticated
 *  
 * @overwrite request.isAuthenticated
 * @see ( https://github.com/jaredhanson/passport/blob/master/lib/http/request.js#L83 )
 * 
 * {this} - context of ExpressJs Request object
 * 
 * @return {Promise}
 */
exports.isAuthenticated = function(){
	let req = this
		
	return new Promise(async function(resolve, reject) {
				
		if( !req.session['jwt'] ){
			resolve(false);		
			return
		}
			
		let accessToken = req.session['jwt']
		var decoded = jwt.decode( accessToken );	
				
		let token;
		try{
			token = await Token.findOne({ iss:decoded.iss, isActive:true }).exec()		
		}catch(e){
			reject(new Error("500, server error."))
			return	
		}
		
		if(!token){						
			resolve(false);		
			return
		}
		
		jwt.verify(accessToken, token.secret, async function (err, payload){
			if (err) {									
				resolve(false);		
				return
			}
								
			let user
			try{
				user = await User.findOne( { email: payload.user.email, isActive:true }).exec()	
			}catch(e){
				reject(new Error("500, server error."))
				return			
			}
								
			if(!user){			
				resolve(false);		
				return	
			}
																				
			req.user = user;
			
			resolve(true);																								
			return
		})				
	})					
}


/**
 * Logout a user
 *  
 * @overwrite request.logout()
 * @see ( https://github.com/jaredhanson/passport/blob/master/lib/http/request.js )
 * 
 * {this} - context of ExpressJs Request object
 * 
 */
exports.logout = function logout(){
	let req = this
	
	delete req.session['jwt']
	delete req.session['returnTo']
}
