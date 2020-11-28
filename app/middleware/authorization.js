var mongoose = require('mongoose');
var Log = mongoose.model('Log');
var config = require('../config/config');

/*
 *  Generic require login routing middleware
 */
exports.requiresLogin = function (req, res, next) {
  if (req.isAuthenticated()) return next()
  if (req.method == 'GET') req.session.returnTo = req.originalUrl
  res.redirect('/login')
}

exports.hasLogin = function (req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect('/')
  } else {
    next()
  }
}

/*
 *  User authorization routing middleware
 */
exports.user = {
  hasAuthorization: function (req, res, next) {
    if (req.profile.id != req.user.id) {
      req.flash('info', 'You are not authorized')
      return res.redirect('/users/' + req.profile.id)
    }
    next()
  }
}

/**
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
 		new Log({"status": authorized?200:401, "user":req.user.email, "message":`${req.method} ${req.path}`}).save()
 	}
  	  	  	  	
    if (authorized){    	
      next();
    }else{    	     	    	 		    	    					    	
    	req.flash('error', 'Na tuto akci nemáte dostatečná oprávnění.')    	  		    	  
    	res.redirect('/401');
    	return      
    }
  };
};
