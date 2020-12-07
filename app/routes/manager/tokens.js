const express = require('express');
const Route = express.Router();
const config = require('../../config/config');
const Auth = require(config.root + '/app/middleware/authorization');
const managerTokensController = require(config.root + '/app/controllers/manager/tokens');

Route			
	.get('/all', Auth.requiresLogin, Auth.needsRole(['admin']), managerTokensController.all)
	.get('/create', Auth.requiresLogin, Auth.needsRole(['admin']), managerTokensController.create)
	.post('/save', Auth.requiresLogin, Auth.needsRole(['admin']), managerTokensController.save)
	.get('/toggle/:id', Auth.requiresLogin, Auth.needsRole(['admin']), managerTokensController.toggle)
	.get('/edit/:id', Auth.requiresLogin, Auth.needsRole(['admin']), managerTokensController.edit)
	.get('/delete/:id', Auth.requiresLogin, Auth.needsRole(['admin']), managerTokensController.delete)
module.exports = Route