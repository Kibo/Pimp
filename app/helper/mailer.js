"use strict";
const nodemailer 		= require('nodemailer');
const config = require('../config/config');
const ejs = require('ejs');
const path = require('path');
const TEMPLATE_DIR = path.resolve('app', 'views', 'email');

var smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: config.mail.user,
        pass: config.mail.password
    }
});

/**
 * @return {Promise}
 */
exports.isManager = function(){			
	return smtpTransport.verify()		
}

exports.sendMail = function ( data ) {
					
	return new Promise(function( resolve, reject ){															
  			ejs.renderFile(
				path.resolve(TEMPLATE_DIR, data.template), data.templateData,
			 	{}, 
			 	function(err, str){    									
					if (err) {			    		    
						reject(err)		
					}
								
					smtpTransport.sendMail({
						from: config.mail.user,
						to:	data.to,
						subject: data.subject,
						html: str		    	
					}, function( err, info ){
						if(err){
							reject(err);
						}			
						resolve(info);
					});										
			});   			  													
	});	
}