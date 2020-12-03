const express = require('express');
const Route = express.Router();
const config = require('../../config/config');
const Auth = require(config.root + '/app/middleware/authorization');
const managerLogController = require(config.root + '/app/controllers/manager/logs');

Route			
	.get('/all', Auth.requiresLogin, Auth.needsRole(['admin']), managerLogController.all)
  	.get('/delete/all', Auth.requiresLogin, Auth.needsRole(['admin']), managerLogController.deleteAll)
  	.get('/delete/:id', Auth.requiresLogin, Auth.needsRole(['admin']), managerLogController.delete)
module.exports = Route