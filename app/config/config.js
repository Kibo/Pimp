var path = require('path');
var os = require('os');
var rootPath = path.normalize(__dirname + '/../..');

var config = {
	
	development: {
		root: rootPath,				
		server: {
      		port: 3000,
      		hostname: 'localhost',
    	},
    	
    	database: {
      		url: 'mongodb://localhost:27017/pimp'
    	},
    	
    	mail: {
			user: 'TODO@gmail.com',
			password: 's5cr5t',	
		},							
		Recaptcha:{
			SITE_KEY:'',
			SECRET_KEY:'',
			BOT_SCORE_THRESHOLD:0.3
		},					
		log:{
			isLog:false
		},
		google:{
			CLIENT_ID:"",
			CLIENT_SECRET:"",
			callbackURL:"http://localhost:3000/login/google/callback"
		}
	},	
	
	production: {},		
	test: {}
}

module.exports = config[process.env.NODE_ENV || 'development'];