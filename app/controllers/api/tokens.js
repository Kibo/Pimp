const mongoose = require('mongoose');
const Token = mongoose.model('Token');
const User = mongoose.model('User');
const config = require('../../config/config');
const errorHelper = require(config.root + '/app/helper/errors');
const jwt = require('jsonwebtoken');

exports.login = function (req, res, next) {
	const { email, password, iss } = req.body;
		
	if(!email || !password || !iss ){				
		res.status(401)
		res.send('Missing credentials.');
		return	
	}
	
	User.findOne( { email: email } , async function (err, user) {
		if(err){
			res.status(500);
			res.send('Oops. An error has occured.');
			return
		}
		
		if(!user || !user.authenticate(password) ){
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
			res.status(401)
			res.send('Incorrect credentials');
			return	
		}
					
		let payload = {
			iat: (new Date().getTime() / 1000), //actual Time in seconds
			user:{
				userId: user.id,
				firstname: user.firstname,
				lastname: user.lastname,
				email: user.email,
				roles: user.roles,
				isActive: user.isActive,
				isNotification: user.isNotification}			
		}
						
		let options = {
			algorithm: token.alg,
			issuer: iss,			
			//expiresIn: new Date().getTime() + token.exp,			
			expiresIn: Math.floor((new Date().getTime() + 60 * 60 * 1000)/1000) // 1h
		}						
				
		const accessToken = jwt.sign(payload, token.secret, options);
				
		res.status(200)
		res.json({
            accessToken
        });
		return 		
	})			
}

exports.refresh = function (req, res) {		
	return
}
