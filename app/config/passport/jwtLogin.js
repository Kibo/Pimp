const mongoose		= require('mongoose')
const JwtStrategy 	= require('passport-jwt').Strategy
const ExtractJwt 	= require('passport-jwt').ExtractJwt
const User			= mongoose.model('User')
const Token			= mongoose.model('Token')
const config 		= require('../config');

module.exports = async function(passport){	
	let token = await Token.findOne({iss:"local", isActive:true}).exec()	
	if(!token){
		throw new Error('Token for local login required. Iss: ' + config.jwt.iss); 	
	}
		
	passport.use(new JwtStrategy({
		jwtFromRequest:ExtractJwt.fromBodyField("accessToken"),
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
          		return done(null, false, {message: 'Sorry, your account is not active.'})
        	}
	        
	        return done(null, user);	        	        	       
	    });	    	
	}));
}
	
  
  