const express = require('express');
const Route = express.Router();
const config = require('../../config/config');
const Auth = require(config.root + '/app/middleware/authorization');
const managerUserController = require(config.root + '/app/controllers/manager/users');
const API = require(config.root + '/app/middleware/jwt');

Route		
	.get('/all', 
		Auth.requiresLogin, 
		Auth.needsRole(['admin']), 
		API.refresh, 
		managerUserController.all)	
	.get('/create', 
		Auth.requiresLogin, 
		Auth.needsRole(['admin']),
		API.refresh, 
		managerUserController.create)	
	.get('/edit/:id', 
		Auth.requiresLogin, 
		Auth.needsRole(['admin']),
		API.refresh, 
		managerUserController.edit)
	.post('/save', 
		Auth.requiresLogin, 
		Auth.needsRole(['admin']),
		API.refresh, 
		managerUserController.save)
	.get('/password/edit/:id', 
		Auth.requiresLogin, 
		Auth.needsRole(['admin']),
		API.refresh, 
		managerUserController.password)
	.post('/password/save', 
		Auth.requiresLogin, 
		Auth.needsRole(['admin']),
		API.refresh, 
		managerUserController.passwordSave)	
	.get('/delete/:id', 
		Auth.requiresLogin, 
		Auth.needsRole(['admin']),
		API.refresh, 
		managerUserController.delete)
	.get('/toggle/:id', 
		Auth.requiresLogin, 
		Auth.needsRole(['admin']),
		API.refresh, 
		managerUserController.toggle)
module.exports = Route