var mongoose = require('mongoose');
var utils = require('keystone-utils');
var User = mongoose.model('User');
var config = require('../config/config');
var errorHelper = require(config.root + '/app/helper/errors');
var Mailer   = require(config.root + '/app/helper/mailer');

var login = function (req, res) {	
  var redirectTo = req.session.returnTo ? req.session.returnTo : '/users/profile'
  delete req.session.returnTo
  req.flash('success', { msg: 'Success! You are logged in.' });
  res.redirect(redirectTo)
}

/**
 * Session
 */
exports.session = login

/**
 * Show login form
 */
exports.login = function (req, res) {		
  if(req.isAuthenticated()){
    res.redirect('/user/profile')
  }else{  	  	  	 
    res.render('users/login', {      
      errors: req.flash('error'),
      email:req.flash('email')      
    })
  }
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
  if(req.isAuthenticated()){
    res.redirect('/')
  } else {
    res.render('users/signup', {      
      user: new User()
    })
  }
}

/**
 * Create user
 */
exports.create = function (req, res, next) {
  var user = new User(req.body)
  user.provider = 'local'  
  user.isActive = false
  user.isNotofication = false  
  user.roles.push("member")
        
  user.save(function (err, new_user) {
    if (err) {       	        	    	    
      return res.render('users/signup', {      	      	     
        errors: errorHelper.proper(err.errors),
        user: user        
      })
    } else {
		
	   console.log(user)
      // manually login the user once successfully signed up
      req.logIn(user, function(err) {
        if (err) {
          console.log(err)
          return next(err)
        }
                                                                       
        req.flash('info', {'msg':'Success! You are signed-up.'})
        return res.redirect('/users/profile') 
      })				 	                                                      	               
    }
  })
}

exports.forgetPasswordForm = function( req, res, next ){
	if(req.isAuthenticated()){
    	res.redirect('/')
  	} else {
    	res.render('users/reset-password', {      
      	email: ''
    })
  }
}

exports.resetPassword = function( req, res, next ){
		
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
												
		user.password = utils.randomString([8, 8]);
		
		user.save(function(err){
			if(err){
				console.error( err )
				req.flash('errors', {'msg':'Heslo se nepodařilo resetovat.'})					
				res.redirect('/forget-password');
				return	
			}	
						
			Mailer.sendMail({
			to:user.email, 
			subject:"Reset", 
			template:"reset.ejs",
			templateData:{password:user.password}
			}).then(function( result){			
				req.flash('info', {'msg':'Email s dočasným heslem byl odeslán.'})									
				res.redirect('/login');					
				return 											
			}, function(err){
				console.error( err )					
				req.flash('errors', {'msg':'Chyba odeslání emailu.'})
				res.render('users/reset', {      
      				email: req.body['email']
    			})			 
				return
			})									
		});																							 	
	})	
}

exports.profile = async function(req, res, next){
	res.render('users/profile', {      
    	user: req.user   
    })	
	return	
}
