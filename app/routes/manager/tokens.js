const express = require('express');
const Route = express.Router();
const config = require('../../config/config');
const Auth = require(config.root + '/app/middleware/authorization');
const managerTokensController = require(config.root + '/app/controllers/manager/tokens');

Route			
	.get('/all', Auth.requiresLogin, Auth.needsRole(['admin']), managerTokensController.all)
module.exports = Route