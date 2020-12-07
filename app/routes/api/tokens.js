const express = require('express');
const Route = express.Router();
const config = require('../../config/config');
const Auth = require(config.root + '/app/middleware/authorization');
const tokensController = require(config.root + '/app/controllers/api/tokens');

Route			
	.post('/login', tokensController.login)
	.post('/refresh', tokensController.refresh)
module.exports = Route