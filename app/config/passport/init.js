const config 		= require('../config');
const jwtStrategy = require('./jwtLogin');

module.exports = function (app, passport) {	
	jwtStrategy(passport)	
}
