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
			user: 'todo@google.cz',
			password: 'secred96',	
		},							
		Recaptcha:{
			SITE_KEY:'',
			SECRET_KEY:'',
			BOT_SCORE_THRESHOLD:0.3
		},					
		log:{
			isLog:true
		},
		jwt:{
			local:{
				iss:"local"
			}
		}		
	},	
	
	production: {
		
		root: rootPath,		
						
		server: {
			port: 3000,
			hostname: `${process.env.HOST_NAME || 'localhost'}`
		},

		database: {
			url: process.env.DB_USERNAME 
			? `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 27017}/${process.env.DB_NAME || 'pimp'}`
			: `mongodb://${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 27017}/${process.env.DB_NAME || 'pimp'}`
		},
		
		mail: {
			user: 'todo@google.cz',
			password: 'secred96',	
		},							
		Recaptcha:{
			SITE_KEY:'',
			SECRET_KEY:'',
			BOT_SCORE_THRESHOLD:0.3
		},					
		log:{
			isLog:true
		},
		jwt:{
			local:{
				iss:"local"
			}
		}					
	},		
	
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
			isLog:true
		},
		jwt:{
			local:{
				iss:"local"
			}
		}		
	}
}

module.exports = config[process.env.NODE_ENV || 'development'];