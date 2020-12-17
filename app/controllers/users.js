var mongoose = require('mongoose');
var utils = require('keystone-utils');
var User = mongoose.model('User');
var config = require('../config/config');
var errorHelper = require(config.root + '/app/helper/errors');
var Mailer   = require(config.root + '/app/helper/mailer');

const USER_HOME ='/users/profile'

exports.session = function (req, res) {		
  var redirectTo = req.session.returnTo ? req.session.returnTo : USER_HOME
  delete req.session.returnTo
  req.flash('success', { msg: 'Success! You are logged in.' });    
  res.redirect(redirectTo)
}

/**
 * Show login form
 */
exports.login = function (req, res) {
	req.isAuthenticated().then(
		function(result){
			if(result){
				res.redirect(USER_HOME )  
				return
			}
			
			res.render('users/login', {      
				errors: req.flash('error'),
				email:req.flash('email')      
			})
			
		}, 
		function(err){
			res.status(500); 
  			res.render('500');
  			return;	
		})	
}

/**
 * Logout
 */
exports.logout = function (req, res) {
  req.logout()
  req.flash('success', { msg: 'Success! You are logout' });
  res.redirect('/')
}

/**
 * Show sign up form
 */
exports.signup = function (req, res) {
	req.isAuthenticated().then(
		function(result){
			if(result){
				res.redirect(USER_HOME )
				return
			}
			
			res.render('users/signup', {      
				user: new User()
			})
			return
		}, 
		function(err){
			res.status(500); 
  			res.render('500');
  			return;	
		})	
}

/**
 * Create user
 */
exports.create = function (req, res, next) {
  var user = new User(req.body)
  user.provider = 'local'  
  user.isActive = true
  user.isNotofication = false  
  user.roles.push("member")
        
  user.save(function (err, new_user) {
    if (err) {       	        	    	    
      return res.render('users/signup', {      	      	     
        errors: errorHelper.proper(err.errors),
        user: user        
      })
    } else {	
		req.flash('info', {'msg':'Success! You are signed-up.'})
		return res.redirect("/login")        		  				 	                                                      	             
    }
  })
}

exports.forgetPasswordForm = function( req, res, next ){
	req.isAuthenticated().then(
		function(result){
			if(result){
				res.redirect(USER_HOME )
				return
			}
			
			res.render('users/reset-password', {      
      			email: ''
    		})
			return
		}, 
		function(err){
			res.status(500); 
  			res.render('500');
  			return;	
		})	
}

exports.sendResetToken = function( req, res, next ){
	
	if(!req.body['email']){
		res.redirect('/forget-password');	
	}
		
	User.findOne( { email: req.body['email'] } , function (err, user) {			
		
		if (err) {
			console.error( err )
  			req.flash('errors', {'msg':'Nepodařilo se ověřit uživatele.'})					
			res.redirect('/forget-password');
			return
		}
		
		if(!user){
			req.flash('errors', {'msg':'Uživatelel s uvedeným emailem není registrován.'})
			res.render('users/reset-password', {      
      			email: req.body['email']
    		})										
			return
		}
														
		user.resetPasswordToken = utils.randomString([32, 32]);
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
		
		user.save(function(err){
			if(err){
				console.error( err )
				req.flash('errors', {'msg':'Heslo se nepodařilo resetovat.'})					
				res.redirect('/forget-password');
				return	
			}	
						
			sendEmail( user )
			
			req.flash('info', {'msg':'Temporary password has been sent to e-mail.'})									
			res.redirect('/login');					
			return 									
		});																							 	
	})	
}

exports.resetPassword = function( req, res, next ){	
	User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
		req.flash('errors',{'msg':'Password reset token is invalid or has expired.'} );
		res.redirect('/forget-password');
		return	
    }
    res.render('users/change-password', {
      user: req.user
    });
  });
}

exports.savePassword = function( req, res, next ){
	if(!req.body.password){
		req.flash('error', {'msg':'Password cannot be blank.'});
		res.redirect('/forget-password');
		return	
	}
		
	User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
		req.flash('errors', {'msg':'Password reset token is invalid or has expired.'});
		res.redirect('/forget-password');
		return	
    }
    	user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        
        user.save(function (err, new_user) {
			if (err) {       	        	    	    
				console.log(err)
				return next(err)
		    } else {
		      req.flash('info', {'msg':'Success! Your password has been changed.'})
			  return res.redirect("/login")
		    }
		})               
  });	
}

exports.profile = function(req, res, next){	
	res.render('users/profile', {      
    	user: req.user   
    })	
	return	
}

async function sendEmail( user ){		
	Mailer.sendMail({
			to:user.email, 
			subject:"Reset", 
			template:"reset.ejs",
			templateData:{resetPasswordToken:user.resetPasswordToken, domain:config.server.hostname}
			})					
}
