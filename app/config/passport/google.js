var mongoose         = require('mongoose')
var passport 		 = require('passport')
var GoogleStrategy 	= require('passport-google-oauth').OAuth2Strategy;
var User             = mongoose.model('User')
var utils 			= require('keystone-utils');
const config 		= require('../config');

module.exports = function(passport){

passport.use('google', new GoogleStrategy({
    clientID: config.google.CLIENT_ID,
    clientSecret: config.google.CLIENT_SECRET,
    callbackURL: config.google.callbackURL,
    passReqToCallback: true
  },
  
  async function(req, accessToken, refreshToken, profile, done) { 
  	let user;
  	
  	try{
  		user = await User.findOne({ email: profile.emails[0].value }).exec();
  	}catch(err){
  		return done(err)	
  	}
  	
  	if (user) {
    	return done(null, user, req.flash('success', {'detail':'Přihlášení bylo úspěšné.'}));
    }
    
    user = new User()
    user.firstname = profile.name.givenName
	user.lastname = profile.name.familyName
	user.email = profile.emails[0].value  
	user.password = utils.randomString([8, 8]),            
	user.isActive = true       
	user.isNotofication = false
	user.roles = []
	user.privider = "google"
  	
  	let newUser;
  	try{
  		newUser = await user.save();	
  	}catch(err){
  		return done(err);	
  	}
  	
  	return done(null, newUser, req.flash('success', {'detail':'Přihlášení bylo úspěšné.'}));  	  	  	  	  	  	
  }  
  ))
 }