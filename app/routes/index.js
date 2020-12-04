const express = require('express');
const Route = express.Router();
const config = require('../config/config');
const passport = require('passport');

const managerUsersRoutes = require('./manager/users');
const managerTokensRoutes = require('./manager/tokens');
const managerLogsRoutes = require('./manager/logs');

const Auth = require(config.root + '/app/middleware/authorization');
const Recaptcha = require(config.root + '/app/middleware/recaptcha');

const pageController = require(config.root + '/app/controllers/pages');
const userController = require(config.root + '/app/controllers/users');

// Frontend routesuploads
Route	
	// Web Index page
	.get('/', function(req, res){
		res.redirect(config.pages.index);
	 })
	 
	 // Common
	.get('/pages/index', pageController.index)
  
	.get('/login', userController.login)	
	.get('/logout', userController.logout)
	.get('/forget-password', userController.forgetPasswordForm)
	.post('/reset-password', userController.resetPassword)	 
	 .get('/signup', userController.signup)     
	 
	.post('/users/create', userController.create)	
	.post('/users/session', 
		passport.authenticate('local', {failureRedirect: '/login', failureFlash: true}), 
		userController.session)
	.get('/users/profile', Auth.requiresLogin, userController.profile)	
		  			  
	 //Manager		
	.use('/manager/users', managerUsersRoutes)
	.use('/manager/tokens', managerTokensRoutes)
	.use('/manager/logs', managerLogsRoutes)
		
	.get('/401', function(req, res){ 
  		res.status(401); 
  		res.render('401');
  		return;});
  
module.exports = Route