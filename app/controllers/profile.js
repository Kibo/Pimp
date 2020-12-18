var mongoose = require('mongoose');
var utils = require('keystone-utils');
var User = mongoose.model('User');
var config = require('../config/config');
var errorHelper = require(config.root + '/app/helper/errors');
var Mailer   = require(config.root + '/app/helper/mailer');


exports.show = function( req, res, next ){		
	return res.render('profile/show', {      	      	            
		user: req.user      
	})
}

exports.passwordSave = async function( req, res, next ){
	let user = await User.findById( req.body['id']  ).exec()
	user.password = req.body['password']
	
	try {
  		await user.save()
  	}catch(err){
  		return res.render('profile/show', {      	      	            
        	user: user,
        	errors: errorHelper.proper(err.errors),     
      	})
  	}
  	  
 	req.flash('success', {'msg':'User has been updated.'})					
	res.redirect('/profile/show');
	return  	
}

exports.toggle = async function( req, res, next ){		
	let user = await User.findById( req.user.id  ).exec()
	user.isNotification = user.isNotification ? false : true;
	
	try {
  		await user.save()
  	}catch(err){
  		req.flash('errors', {'msg':'Opps, Error change status.'})					
		res.redirect('/profile/show');
		return
  	}
  	
  	req.flash('success', {'msg':'User has been updated.'})			
		res.redirect('/profile/show');
		return   	  	  	  	  	  	  
}