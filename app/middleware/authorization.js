var mongoose = require('mongoose');
var Log = mongoose.model('Log');
var Token = mongoose.model('Log');
var config = require('../config/config');
const jwt = require('jsonwebtoken');

/*
 *  Generic require login routing middleware
 */
exports.requiresLogin = function (req, res, next) {
		
	req.isAuthenticated().then(function(result) {
		if( result ){
			return next()	
		}
		
		if (req.method == 'GET'){ 
			req.session.returnTo = req.originalUrl
		}
	
		res.redirect('/login')
		return 
				
	}, function(err) {
		res.status(500); 
  		res.render('500');
  		return;	
	});			
}

/*
 * Check login user role
 * 
 * @param {Array} roles
 */
exports.needsRole = function(roles) {
  return function(req, res, next) {
  	
  	var authorized = false; 
 	for(var i = 0, ln = roles.length; i < ln; i++){
 		if (req.user && req.user.hasRole(roles[i])){ 			
 			authorized = true;	
 		}
 	}	
 	
 	if(config.log.isLog){
 		try{
 			new Log({"status": authorized?200:401, "iss":config.jwt.local.iss, "user":req.user.email, "message":`${req.method} ${req.originalUrl}`}).save()	
 		}catch(e){
			conslole.error(e) 			
 		} 		 		
 	}
  	  	  	  	
    if (authorized){    	
      next();
    }else{    	     	    	 		    	    					    	
    	req.flash('error', 'Insufficient permissions to perform this action.')    	  		    	  
    	res.redirect('/401');
    	return      
    }
  };
};