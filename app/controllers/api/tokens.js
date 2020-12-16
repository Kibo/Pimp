const mongoose = require('mongoose');
const Token = mongoose.model('Token');
const Log = mongoose.model('Log');
const User = mongoose.model('User');
const config = require('../../config/config');
const errorHelper = require(config.root + '/app/helper/errors');
const jwt = require('jsonwebtoken');

exports.login = function (req, res, next) {
	const { email, password, iss } = req.body;
		
	if( !email || !password || !iss){
		logIt(401, iss, email, req.method, req.originalUrl, "Missing credentials")
								
		res.status(401)
		res.send('Missing credentials');
		return	
	}
	
	User.findOne( { email: email, isActive:true } , async function (err, user) {
		if(err){
			res.status(500);
			res.send('Oops. An error has occured.');
			return
		}
		
		if(!user || !user.authenticate(password) ){
			logIt(401, iss, email, req.method, req.originalUrl, "Incorrect credentials")
						
			res.status(401)
			res.send('Incorrect credentials');
			return
		}
					
		let token;
		try{
			token = await Token.findOne({ iss:iss, isActive:true }).exec()	
		}catch(e){
			res.status(500);
			res.send('Oops. An error has occured.');
			return	
		}
		
		if(!token){
			logIt(401, iss, email, req.method, req.originalUrl, "Missing token")
			
			res.status(401)
			res.send('Incorrect credentials');
			return	
		}
					
		logIt(200, iss, email, req.method, req.originalUrl, "Success login")
																																				
		res.status(200)
		res.json({
            accessToken:getToken(token, user)
        });
		return 		
	})			
}

exports.refresh = async function (req, res, next) {		
	const authHeader = req.headers.authorization;
		
	if( !authHeader){		
		logIt(401, iss, email, req.method, req.originalUrl, "Missing autHeader")
						
		res.status(401)
		res.send('Missing credentials.');
		return	
	}
	
	const accessToken = authHeader.split(' ')[1];
	var decoded = jwt.decode( accessToken );
		
	let token;
	try{
		token = await Token.findOne({ iss:decoded.iss, isActive:true }).exec()	
	}catch(e){							
		res.status(500);
		res.send('Oops. An error has occured.');
		return	
	}
	
	if(!token){
		logIt(401, decoded.iss, decoded.user.email, req.method, req.originalUrl, "Missing token")
		
		res.status(401)
		res.send('Incorrect credentials');
		return	
	}
		
	jwt.verify(accessToken, token.secret, async function (err, payload){
		if (err) {
			logIt(403, decoded.iss, decoded.user.email, req.method, req.originalUrl, "Verify token: " + err.message)
																
			res.status(403);
			res.send( err.message );            	
		    return
		}
						
		let user
		try{
			user = await User.findOne( { email: payload.user.email, isActive:true }).exec()	
		}catch(e){
			res.status(500);
			res.send('Oops. An error has occured.');
			return		
		}
		
		if(!user){
			logIt(401, decoded.iss, decoded.user.email, req.method, req.originalUrl, "Missing user")
			
			res.status(401)
			res.send('Incorrect credentials');
			return	
		}
		
		logIt(200, decoded.iss, decoded.user.email, req.method, req.originalUrl, "Refresh success")
																										
		res.status(200)
		res.json({
	        accessToken:getToken(token, user)
	    });
		return					         
     });	
}

/**
 * Create JWT token
 * 
 * @param {Object} token
 * @param {Object} user
 * 
 * @return {Object} jwt
 */
function getToken( token, user){	
	return jwt.sign(
			getPayload(token, user), 
			token.secret, 
			getOptionsForJWT(token));
}

/**
 * Create payload for JWT
 * 
 * @param {Object} token
 * @param {Object} user
 * @param {Number} nowInSecond - default now in seconds
 * 
 * @return {Object}
 */
function getPayload(token, user, nowInSecond = Math.floor( new Date().getTime() / 1000 )){	
	return {
			iat: nowInSecond, 
			exp: nowInSecond + token.exp,
			iss: token.iss,
			user:user.toPayload()			
	}	
}

/**
 * Create options for JWT token
 * 
 * @param {Object} token
 * @return {Object} options
 */
function getOptionsForJWT( token ){
	return {
			algorithm: token.alg,												
		}				
}

function logIt(status, iss, user, method, url, message){
	if(config.log.isLog){
		try{
			new Log({"status": status, "iss":iss, "user":user, "method":method, "url":url, "message":message}).save()
		}catch(e){
			console.error(e)
		}
	}
}
