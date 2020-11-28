var mongoose = require('mongoose');
var utils = require('keystone-utils');
var Form = mongoose.model('Form');
var config = require('../../config/config');
var errorHelper = require(config.root + '/app/helper/errors');
var Mailer   = require(config.root + '/app/helper/mailer');
var fs = require('fs');
const path = require('path');

exports.all = async function( req, res, next ){	
	
	if( !fs.existsSync( path.join(config.root, "app/views/forms", req.params.name)) ){
		res.redirect('/401');	
	}
		
	return res.render('forms/' + req.params.name + '/all', {      	      	            
        forms: await Form.find({name:req.params.name}).sort({ created: 'desc'})     
      })
}

exports.edit = async function( req, res, next ){		
	return res.render('manager/forms/managerFrame', {      	      	            
        form:await Form.findById( req.params.id  ).exec()    
    })	
}

exports.save = async function( req, res, next ){
	
	let form = await Form.findById( req.body.id  ).exec()
	req.body.created = form.created; // it keeps original submited time			
	form.overwrite( req.body )
	
	try {
  		await form.save()
  	}catch(err){  		  		  
  		return res.render('manager/forms/managerFrame', {      	      	            
        		form: form,
        		errors: errorHelper.proper(err.errors),     
      		})
  	}
			 
	req.flash('success', {'msg':'Formulář byl uložen.'})					
	res.redirect('/manager/forms/all/' + form.name);
	return					 	  	
}

exports.delete = function( req, res, next ){
	Form.findByIdAndDelete(req.params.id, function (err, form) {
  		if(err){
  			req.flash('error', {'msg':'Opps, Error deleting form.'})					
			res.redirect('/manager/forms/all/' + form.name);
			return	
  		} 
  		req.flash('success', {'msg':'Formulář byl smazán.'})					
		res.redirect('/manager/forms/all/' + form.name);
		return
	}) 
}

exports.deleteAll = async function( req, res, next ){
	if( !fs.existsSync( path.join(config.root, "app/views/forms", req.params.name)) ){
		res.redirect('/401');	
	}	
		
	await Form.remove({"name":req.params.name});
	
	req.flash('success', {'msg':'Vše smazáno.'})					
	res.redirect('/manager/forms/all/' + req.params.name);
	return																			
}	

