const express = require('express');
const Route = express.Router();
const config = require('../../config/config');
const Auth = require(config.root + '/app/middleware/authorization');
const managerLogController = require(config.root + '/app/controllers/manager/logs');
const API = require(config.root + '/app/middleware/jwt');

Route			
	.get('/all', 
		Auth.requiresLogin, 
		Auth.needsRole(['admin']), 
		API.refresh,
		managerLogController.all)
  	.get('/delete/all', 
  		Auth.requiresLogin, 
  		Auth.needsRole(['admin']), 
  		API.refresh,
  		managerLogController.deleteAll)
  	.get('/delete/:id', 
  		Auth.requiresLogin, 
  		Auth.needsRole(['admin']), 
  		API.refresh,
  		managerLogController.delete)
module.exports = Route