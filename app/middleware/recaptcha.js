"use strict";

const https = require('https')
const config = require('../config/config');

const RECAPTCHA_HOST_URL="www.google.com";
const RECAPTCHA_VERIFY_URL="/recaptcha/api/siteverify";

exports.verify = function (req, respon, next) {
		
	if( !config.Recaptcha.SITE_KEY){		
		next()
		return	
	}
			    	 
    if ( !(req.body && req.body['recaptcha-response'])  ){
    	next()
    	return
    }
    
    var query_string = 'secret=' + config.Recaptcha.SECRET_KEY + '&response=' + req.body['recaptcha-response'];
    var remote_ip = req.headers && req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'] : req.connection.remoteAddress;
    if (remote_ip){
    	query_string += '&remoteip=' + remote_ip;
    }
                   				    
    var options = {
	    hostname: RECAPTCHA_HOST_URL,
	    port: '443',
	    path: RECAPTCHA_VERIFY_URL,
	    method: 'POST',
	    headers: {
	        'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength( query_string )
	    }
    };
               
    var postReq = https.request( options , function (res) { 
    		let result = '';   		
    		res.setEncoding('utf8');
    	                                  
            res.on('data', function ( data ) { 
            	result += data;            	             	           	          					        
            });
            
            res.on('error', function(error) {
            	console.error(error)
            });
            
            res.on('end', function() {
            	if( res.statusCode === 200 ){
            		delete req.body['recaptcha-response']
            		req.body['captcha'] = JSON.parse(result)            		
            	}  				            	            	           
  				next()
  				return
			})
	 })
        	
     postReq.write( query_string )
     postReq.end();                            
}