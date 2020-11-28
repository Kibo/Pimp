var config = require('../config/config');
var errorHelper = require(config.root + '/app/helper/errors');
var Page = require(config.root + '/app/models/page');
var Form = require(config.root + '/app/models/form');
var User = require(config.root + '/app/models/user');
var app 	 = require(config.root + '/server');
var utils = require('keystone-utils');
var moment = require('moment');
const Mailer   = require(config.root + '/app/helper/mailer');
const _                = require('underscore');

exports.save = async function (req, res, next) {
		
	if(req.body['captcha'] && req.body['captcha'].score <= config.Recaptcha.BOT_SCORE_THRESHOLD){
		req.flash('errors', {'msg':'Formulář nebyl odeslán.'})					
		res.redirect('/pages/' + req.body.page + "#form")
		return				
	}
	
	console.log( req.body['captcha'] )
					
	let form = new Form(req.body)
	
	try {
  		await form.save()
  	}catch(err){  		  		  
  		return res.render('pages/getByUrl', {
  			pages: await Page.find({},['id','title','url','form', 'isHidden']).sort({ rank: 'asc'}).exec(),      	      	            
        	page: await Page.findOne({url:req.body.page}).exec(),
        	form: form, 
        	errors: errorHelper.proper(err.errors),
        	config:config      
      	})  		  		  
  	}
  	
  	sendEmailToAdmins( form )
  	  	  	
 	req.flash('success', {'msg':'Formulář byl odeslán.'})					
	res.redirect('/pages/' + req.body.page + "#form")
	return																	
};

async function sendEmailToAdmins( form ){
	let users = await User.find({isActive:true, isNotofication:true},['email']).exec() 
	let emails = _.pluck(users, 'email')
	if( emails.lenght == 0 ){
		return
	}
			
	Mailer.sendMail({
			to:emails.join(","), 
			subject:"Nový formulář - " + form.name, 
			template:"notice.ejs",
			templateData:{'form':form, 'domain': config.server.hostname}
			})					
}