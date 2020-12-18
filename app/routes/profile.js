const express = require('express');
const Route = express.Router();
const config = require('../config/config');
const Auth = require(config.root + '/app/middleware/authorization');
const API = require(config.root + '/app/middleware/jwt');
const profileController = require(config.root + '/app/controllers/profile');

Route	
	.get('/show', 
			Auth.requiresLogin, 
			API.refresh, 
			profileController.show)
	.post('/password/save', 
			Auth.requiresLogin,
			API.refresh,
			profileController.passwordSave)
	.get('/toggle', 
			Auth.requiresLogin,
			API.refresh,
			profileController.toggle)
	
module.exports = Route