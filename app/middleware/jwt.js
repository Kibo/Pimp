"use strict";

const http = require('http')
const config = require('../config/config');

const API_LOGIN_URL="/api/v1/login";

exports.login = function (req, res, next) {
						    	    
    let data = JSON.stringify({
    	email:req.body['email'],
    	password:req.body['password'],
    	iss:"local",
    })
                               				
    var options = {
	    hostname: config.server.hostname,
	    port: config.server.port,
	    path: API_LOGIN_URL,
	    method: 'POST',
	    headers: {
	        'Content-Type': 'application/json',
	        'Content-Length': data.length    
	    }
    };
                              
    var postReq = http.request( options , function (res) {   
    		let result = '';
    	 		
    		res.setEncoding('utf8');
    	                                  
            res.on('data', function ( data ) {            	
            	result += data;          	          					         
            });
            
            res.on('error', function(error) {            	
            	console.error(error)
            });
            
            res.on('end', function() {
            	req.body['accessToken'] = JSON.parse(result).accessToken
  				next()
  				return
			})
	 })
             
     postReq.write( data )
     postReq.end();                            
}