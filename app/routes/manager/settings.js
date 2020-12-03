const express = require('express');
const Route = express.Router();
const config = require('../../config/config');
const Auth = require(config.root + '/app/middleware/authorization');
const managerSettingsController = require(config.root + '/app/controllers/manager/settings');

Route			
	.get('/all', Auth.requiresLogin, Auth.needsRole(['admin']), managerSettingsController.all)
module.exports = Route