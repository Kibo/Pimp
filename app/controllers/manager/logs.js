var mongoose = require('mongoose');
var utils = require('keystone-utils');
var Log = mongoose.model('Log');
var config = require('../../config/config');
var errorHelper = require(config.root + '/app/helper/errors');
var Mailer   = require(config.root + '/app/helper/mailer');

exports.all = async function (req, res, next) {			
	return res.render('manager/logs/all', {
		"logs": await Log.find({}).sort({ 'created': 'desc'}),
		"config":config
	})																	
};

exports.delete = async function (req, res, next) {	
	Log.findByIdAndDelete(req.params.id, function (err) {
  		if(err){
  			req.flash('error', {'msg':'Opps, Error deleting log.'})					
			res.redirect('/manager/logs/all');
			return	
  		} 
  		req.flash('success', {'msg':'Záznam byl smazán.'})					
		res.redirect('/manager/logs/all');
		return
	})
};

exports.deleteAll = async function (req, res, next) {
	await Log.remove({});
	req.flash('success', {'msg':'Vše smazáno.'})					
	res.redirect('/manager/logs/all');
	return																			
};