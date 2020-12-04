const express = require('express');
const Route = express.Router();
const config = require('../../config/config');
const Auth = require(config.root + '/app/middleware/authorization');
const managerUserController = require(config.root + '/app/controllers/manager/users');

Route		
	.get('/all', Auth.requiresLogin, Auth.needsRole(['admin']), managerUserController.all)	
	.get('/create', Auth.requiresLogin, Auth.needsRole(['admin']), managerUserController.create)	
	.get('/edit/:id', Auth.requiresLogin, Auth.needsRole(['admin']), managerUserController.edit)
	.post('/save', Auth.requiresLogin, Auth.needsRole(['admin']), managerUserController.save)
	.get('/password/edit/:id', Auth.requiresLogin, Auth.needsRole(['admin']), managerUserController.password)
	.post('/password/save', Auth.requiresLogin, Auth.needsRole(['admin']), managerUserController.passwordSave)	
	.get('/delete/:id', Auth.requiresLogin, Auth.needsRole(['admin']), managerUserController.delete)
	.get('/toggle/:id', Auth.requiresLogin, Auth.needsRole(['admin']), managerUserController.toggle)
module.exports = Route