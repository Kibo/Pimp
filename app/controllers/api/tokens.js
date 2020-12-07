var mongoose = require('mongoose');
var utils = require('keystone-utils');
var Token = mongoose.model('Token');
var config = require('../../config/config');
var errorHelper = require(config.root + '/app/helper/errors');
var Mailer   = require(config.root + '/app/helper/mailer');

exports.login = function (req, res) {		
	return 
}

exports.refresh = function (req, res) {		
	return
}
