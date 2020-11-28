var express = require('express');
var Route = express.Router();
var config = require('../config/config');
var fs = require('fs');
var passport = require('passport');

var Auth = require(config.root + '/app/middleware/authorization');
var Recaptcha = require(config.root + '/app/middleware/recaptcha');

var pageController = require(config.root + '/app/controllers/pages');
var userController = require(config.root + '/app/controllers/users');

var managerUserController = require(config.root + '/app/controllers/manager/users');
var managerLogController = require(config.root + '/app/controllers/manager/logs');
 

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
		
	.get('/login/google', passport.authenticate("google", {scope: ['openid', 'email', 'profile']}))
	.get('/login/google/callback',
		passport.authenticate('google', { 
			failureRedirect: '/login',
			failureFlash : true}),
  			userController.session)
  			   
	//Manager
	.get('/manager', Auth.requiresLogin, Auth.needsRole(['admin']), function(req, res){
		res.redirect('/manager/users/all')
	})
	
	// Manager Users			
	.get('/manager/users/all', Auth.requiresLogin, Auth.needsRole(['admin']), managerUserController.all)	
	.get('/manager/users/create', Auth.requiresLogin, Auth.needsRole(['admin']), managerUserController.create)	
	.get('/manager/users/edit/:id', Auth.requiresLogin, Auth.needsRole(['admin']), managerUserController.edit)
	.post('/manager/users/save', Auth.requiresLogin, Auth.needsRole(['admin']), managerUserController.save)
	.get('/manager/users/password/edit/:id', Auth.requiresLogin, Auth.needsRole(['admin']), managerUserController.password)
	.post('/manager/users/password/save', Auth.requiresLogin, Auth.needsRole(['admin']), managerUserController.passwordSave)	
	.get('/manager/users/delete/:id', Auth.requiresLogin, Auth.needsRole(['admin']), managerUserController.delete)
   	
	// Manager Logs
	.get('/manager/logs/all', Auth.requiresLogin, Auth.needsRole(['admin']), managerLogController.all)
  	.get('/manager/logs/delete/all', Auth.requiresLogin, Auth.needsRole(['admin']), managerLogController.deleteAll)
  	.get('/manager/logs/delete/:id', Auth.requiresLogin, Auth.needsRole(['admin']), managerLogController.delete)
		 
	.get('/401', function(req, res){ 
  		res.status(401); 
  		res.render('401');
  		return;});
  
module.exports = Route