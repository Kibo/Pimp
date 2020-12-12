const path = require('path');
const os = require('os');
const rootPath = path.normalize(__dirname + '/../..');

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
			user: 'no-reply@stohl-znojmo.cz',
			password: 'jurman963',	
		},							
		Recaptcha:{
			SITE_KEY:'',
			SECRET_KEY:'',
			BOT_SCORE_THRESHOLD:0.3
		},					
		log:{
			isLog:false
		},
		jwt:{
			local:{
				iss:"local"
			}
		}		
	},	
	
	production: {},		
	test: {
		root: rootPath,		
						
		server: {
			port: 3000,
			hostname: 'localhost',
		},

		database: {
			url: 'mongodb://localhost:27017/pimp-test'
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
		}	
	}
}

module.exports = config[process.env.NODE_ENV || 'development'];