const mongoose         = require('mongoose')
const passport 		 = require('passport')
const User             = mongoose.model('User')
const localStrategy = require('./localLogin');
const config 		= require('../config');

module.exports = function (app, passport) {
	
	// serialize sessions
  passport.serializeUser(function(user, done) {
    done(null, user.id)
  })

  passport.deserializeUser(function(id, done) {
    User.findOne({ _id: id }, function (err, user) {
      done(err, user)
    })
  })  
	
	localStrategy(passport);	
}
