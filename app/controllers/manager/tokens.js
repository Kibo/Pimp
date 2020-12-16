var mongoose = require('mongoose');
var utils = require('keystone-utils');
var Token = mongoose.model('Token');
var config = require('../../config/config');
var errorHelper = require(config.root + '/app/helper/errors');

exports.all = async function (req, res, next) {			
	return res.render('manager/tokens/all', {      	      	            
    	tokens: await Token.find({}).sort({ iss: 'asc'})        
     })																	
};

exports.create = function (req, res, next) {			
	return res.render('manager/tokens/form', {      	      	            
        token: new Token()        
      })																		
};

exports.edit = async function( req, res, next ){		
	return res.render('manager/tokens/form', {      	      	            
        token: await Token.findById( req.params.id  ).exec()      
    })
}

exports.save = async function( req, res, next ){
	let token = await Token.findById( req.body['id']  ).exec()
	if(!token){
		token = new Token()
	}
			  		
	token.iss = req.body['iss']
	token.exp = req.body['exp']
    token.secret = req.body['secret']                 
    token.isActive = req.body['isActive'] ? true : false       
    
       
  	try {
  		await token.save()
  	}catch(err){
  		return res.render('manager/tokens/form', {      	      	            
        	token: token,
        	errors: errorHelper.proper(err.errors),     
      	})
  	}
  
 	req.flash('success', {'msg':'Token has been saved.'})					
	res.redirect('/manager/tokens/all');
	return  
}

exports.toggle = async function( req, res, next ){		
	let token = await Token.findById( req.params.id  ).exec()
	token.isActive = token.isActive ? false : true;
	
	try {
  		await token.save()
  	}catch(err){
  		req.flash('errors', {'msg':'Opps, Error change status.'})					
		res.redirect('/manager/tokens/all');
		return
  	}
  	  	  	 
  	req.flash('success', {'msg':'Token has been updated.'})			
	res.redirect('/manager/tokens/all');
	return 
}

exports.delete = function( req, res, next ){
	Token.findByIdAndDelete(req.params.id, function (err) {
  		if(err){
  			req.flash('errors', {'msg':'Opps, Error deleting token.'})					
			res.redirect('/manager/tokens/all');
			return	
  		} 
  		req.flash('success', {'msg':'Token has been deleted.'})					
		res.redirect('/manager/tokens/all');
		return
	}) 
}
