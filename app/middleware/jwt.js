"use strict";

const http = require('http')
const config = require('../config/config');
const jwt = require('jsonwebtoken');

const API_LOGIN_URL="/api/v1/login";
const API_REFRESH_URL="/api/v1/refresh";

/**
 * It obtains a token and stores it in a cookie.
 * 
 * @param {Object} req
 * @param {Object} respon
 * @param {Object} next
 */
exports.login = function (req, respon, next) {
						    	    
    let data = JSON.stringify({
    	email:req.body['email'],
    	password:req.body['password'],
    	iss:config.jwt.local.iss,
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
            	if( res.statusCode === 200 ){
            		req.session['jwt'] = JSON.parse(result).accessToken
            		next()
  					return	
            	}            	            	   	                      
  				
  				
  				req.flash('errors', { msg: 'Incorrect credentials' });
  				respon.redirect('/login')  				
  				return
			})
	 })
             
     postReq.write( data )
     postReq.end();                            
}

/**
 * It refresh a token and stores it in a cookie.
 * 
 * @param {Object} req
 * @param {Object} respon
 * @param {Object} next
 */
exports.refresh = function (req, respon, next) {
	if(!req.session['jwt']){
		next()
		return	
	}
	
	var decoded = jwt.decode( req.session['jwt'] );
					
	// one third of the time before expiration
	let shouldByRefreshed = Math.floor((decoded.exp - decoded.iat) / 3)
	let nowInSecond = Math.floor( new Date().getTime() / 1000 ) 					
	if((decoded.exp - nowInSecond) > shouldByRefreshed){				
		next()
		return	
	}
		
	console.log("### Token refresing" )
		                               		
    var options = {
	    hostname: config.server.hostname,
	    port: config.server.port,
	    path: API_REFRESH_URL,
	    method: 'POST',
	    headers: {
	        'Content-Type': 'application/json',
	        'Authorization': 'Bearer ' + req.session['jwt']    
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
            	if( res.statusCode === 200 ){
            		req.session['jwt'] = JSON.parse(result).accessToken            		           	
  					next()
  					return	
            	}            	            	   	                      
            	  				  				  			
  				respon.redirect('/login')  				
  				return
			})
	 })
             
     postReq.write('')
     postReq.end();    
}