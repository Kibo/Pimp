const mongoose		= require('mongoose')
const JwtStrategy 	= require('passport-jwt').Strategy
const ExtractJwt 	= require('passport-jwt').ExtractJwt
const User			= mongoose.model('User')
const Token			= mongoose.model('Token')
const config 		= require('../config');

module.exports = async function(passport){	
	let token;
	try{
		token = await Token.findOne({iss:config.jwt.local.iss, isActive:true}).exec()	
	}catch(e){
		console.error(e)
		throw new Error('Token for local login required. Iss: ' + config.jwt.local.iss);
	}	
		
	if(!token){
		try{
		 token = await new Token({
				iss:config.jwt.local.iss,
				isActive:true,
				secret:"secr8t987463214" 						
				}).save()
		  }catch(e){
		  	console.error(e)
		  	throw new Error('Token for local login required. Iss: ' + config.jwt.local.iss);
		  }		 	
	}
		
	passport.use(new JwtStrategy({
		jwtFromRequest:cookieExtractor,
		issuer:token.iss,
		secretOrKey:token.secret,
		algorithms:token.alg,
		passReqToCallback: true	
	}, function(req, jwt_payload, done) {
		
		User.findOne({email: jwt_payload.user.email }, function(err, user) {
	        if (err) {	        	
	            return done(err, false);
	        }
	        
	        if(!user){	        	
	        	return done(null, false, {email:email, message: 'Email is not register.' })
	        }
	        
	        if (!user.isActive) {
          		return done(null, false, {message: 'Account is not active.'})
        	}
	        
	        return done(null, user);	        	        	       
	    });	    	
	}));
}
	
var cookieExtractor = function(req) {	
	let token = null;
	if (req && req.session){
		token = req.session['jwt'];
	}
	return token;
};