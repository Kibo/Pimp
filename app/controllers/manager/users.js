var mongoose = require('mongoose');
var utils = require('keystone-utils');
var User = mongoose.model('User');
var config = require('../../config/config');
var errorHelper = require(config.root + '/app/helper/errors');
var Mailer   = require(config.root + '/app/helper/mailer');


exports.create = function( req, res, next ){		
	return res.render('manager/users/user-form', {      	      	            
        user: new User()        
      })
}

exports.all = async function( req, res, next ){		
	return res.render('manager/users/all', {      	      	            
        users: await User.find({}).sort({ lastname: 'asc'})        
      })
}

exports.edit = async function( req, res, next ){		
	return res.render('manager/users/user-form', {      	      	            
        user: await User.findById( req.params.id  ).exec()      
    })
}

exports.save = async function( req, res, next ){
	let user = await User.findById( req.body['id']  ).exec()
	if(!user){
		user = new User()
	}
			  		
	user.firstname = req.body['firstname']
    user.lastname = req.body['lastname']
    user.email = req.body['email']              
    user.isActive = req.body['isActive'] ? true : false       
    user.isNotofication = req.body['isNotofication'] ? true : false
    user.roles = req.body['roles'].replace(/\s/g, '').split(",")
       
  	try {
  		await user.save()
  	}catch(err){
  		return res.render('manager/users/user-form', {      	      	            
        	user: user,
        	errors: errorHelper.proper(err.errors),     
      	})
  	}
  
 	req.flash('success', {'msg':'User has been saved.'})					
	res.redirect('/manager/users/all');
	return  
}

exports.delete = function( req, res, next ){
	User.findByIdAndDelete(req.params.id, function (err) {
  		if(err){
  			req.flash('errors', {'msg':'Opps, Error deleting user.'})					
			res.redirect('/manager/users/all');
			return	
  		} 
  		req.flash('success', {'msg':'User has been deleted.'})					
		res.redirect('/manager/users/all');
		return
	}) 
}

exports.password = async function( req, res, next ){
	return res.render('manager/users/password-form', {      	      	            
        user: await User.findById( req.params.id  ).exec()      
    })	
}

exports.passwordSave = async function( req, res, next ){
	let user = await User.findById( req.body['id']  ).exec()
	user.password = req.body['password']
	
	try {
  		await user.save()
  	}catch(err){
  		return res.render('manager/users/password-form', {      	      	            
        	user: user,
        	errors: errorHelper.proper(err.errors),     
      	})
  	}
  	  
 	req.flash('success', {'msg':'User has been updated.'})					
	res.redirect('/manager/users/all');
	return  	
}