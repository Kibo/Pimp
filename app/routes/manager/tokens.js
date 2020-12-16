const express = require('express');
const Route = express.Router();
const config = require('../../config/config');
const Auth = require(config.root + '/app/middleware/authorization');
const managerTokensController = require(config.root + '/app/controllers/manager/tokens');
const API = require(config.root + '/app/middleware/jwt');

Route			
	.get('/all', 
		Auth.requiresLogin, 
		Auth.needsRole(['admin']), 
		API.refresh,
		managerTokensController.all)
	.get('/create', 
		Auth.requiresLogin, 
		Auth.needsRole(['admin']),
		API.refresh, 
		managerTokensController.create)
	.post('/save', 
		Auth.requiresLogin, 
		Auth.needsRole(['admin']),
		API.refresh, 
		managerTokensController.save)
	.get('/toggle/:id', 
		Auth.requiresLogin, 
		Auth.needsRole(['admin']),
		API.refresh, 
		managerTokensController.toggle)
	.get('/edit/:id', 
		Auth.requiresLogin, 
		Auth.needsRole(['admin']),
		API.refresh, 
		managerTokensController.edit)
	.get('/delete/:id', 
		Auth.requiresLogin, 
		Auth.needsRole(['admin']), 
		API.refresh,
		managerTokensController.delete)
module.exports = Route