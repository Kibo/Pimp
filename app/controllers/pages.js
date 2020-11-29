var config = require('../config/config');
var errorHelper = require(config.root + '/app/helper/errors');
var Form = require(config.root + '/app/models/form');

/**
 * Index page 
 */
exports.index = function (req, res, next) {	
		return res.render('pages/index', {        	        
        	page:{url:"index"}
      	})													
};
