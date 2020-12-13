var config = require('../config/config');
var mongoose = require('mongoose');
var utils = require('keystone-utils');
var User = mongoose.model('User');
var Token = mongoose.model('Token');
var config = require('../config/config');
var errorHelper = require(config.root + '/app/helper/errors');


exports.createAdmin = async function (req, res, next) {
  
  let admin
  try{
  	admin = await  User.findOne({email:"admin@admin.com"}).exec()
  }catch(e){
  	console.error(e)
  	res.status(500); 
  	res.render('500');
  	return;		
  }

  if(!admin){
  	try{
	  	await new User({
			firstname:"Harry", 
			lastname:"Potter", 
			email:"admin@admin.com", 
			password:"1234",
			roles:['admin', 'member'],
			provider:"local",
			isActive:true,
			isNotification:true,			
			}).save()
	  }catch(e){
	  	console.error(e)
	  	res.status(500); 
	  	res.render('500');
	  	return;	
	  }	
  }
            
  req.flash('success', { msg: 'Success! Initialization started.' });
  res.redirect('/login')
}