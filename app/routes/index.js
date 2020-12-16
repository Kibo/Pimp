const express = require('express');
const Route = express.Router();
const config = require('../config/config');
const passport = require('passport');
const cors 				= require('cors');

const managerUsersRoutes = require('./manager/users');
const managerTokensRoutes = require('./manager/tokens');
const managerLogsRoutes = require('./manager/logs');
const apiTokensRoutes = require('./api/tokens');

const Auth = require(config.root + '/app/middleware/authorization');
const Recaptcha = require(config.root + '/app/middleware/recaptcha');
const API = require(config.root + '/app/middleware/jwt');

const initController = require(config.root + '/app/controllers/init');
const userController = require(config.root + '/app/controllers/users');

// Frontend routesuploads
Route	
	// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	// DELETE IT after first login
	.get('/init', initController.createAdmin)

	// Web Index page
	.get('/', function(req, res){
		return res.render('pages/index')
	 })
	 	  
	.get('/login', userController.login)	
	.get('/logout', userController.logout)
	.get('/forget-password', userController.forgetPasswordForm)
	.post('/reset-password', userController.resetPassword)	 
	 .get('/signup', userController.signup)     
	 
	.post('/users/create', userController.create)	
	.post('/users/session', API.login,
		passport.authenticate('jwt', {session: false, failureRedirect: '/login', failureFlash: true}), 
		userController.session)
			
	.get('/users/profile', 			
			Auth.requiresLogin,
			API.refresh, 
			userController.profile)	
	
	// API
	.use('/api/v1/', cors(), apiTokensRoutes)
		  			  
	 //Manager		
	.use('/manager/users', managerUsersRoutes)
	.use('/manager/tokens', managerTokensRoutes)
	.use('/manager/logs', managerLogsRoutes)
		
	.get('/401', function(req, res){ 
  		res.status(401); 
  		res.render('401');
  		return;});
  
module.exports = Route