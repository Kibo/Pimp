const mongoose         = require('mongoose')
const passport 		 = require('passport')
const localStrategy = require('./localLogin');
const jwtStrategy = require('./jwtLogin');
const config 		= require('../config');
var User             = mongoose.model('User')

module.exports = function (app, passport) {

/*		
  passport.serializeUser(function(user, done) {
    done(null, user.id)
  })

  passport.deserializeUser(function(id, done) {
    User.findOne({ _id: id }, function (err, user) {
      done(err, user)
    })
  })
  */  
	
	//localStrategy(passport)
	jwtStrategy(passport)	
}
