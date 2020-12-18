var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');
var oAuthTypes = ['twitter', 'facebook', 'google'];

/**
 * User Schema
 */
var UserSchema = new Schema({ 
  
  firstname: String,
  lastname: String,
  roles:[String],
  isActive:Boolean,
  isNotification:Boolean,
  provider:String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
 
  email: {
    type: String,
    unique: true,
    require: true,
    lowercase: true   
  },
     
  hashed_password: {
    type: String,
    require: true
  },
  salt: {
    type: String
  }  
})

/**
 * Virtuals
 */
UserSchema
  .virtual('password')
  .set(function(password) {
    this._password = password
    this.salt = this.makeSalt()
    this.hashed_password = this.encryptPassword(password)
  })
  .get(function() { return this._password })
  
  
  
/**
 * Validations
 */
var validatePresenceOf = function (value) {
  return value && value.length
}

UserSchema.path('email').validate(function (email) { 
	if (this.doesNotRequireValidation()) return true 
  	return email.length
}, 'Email cannot be blank.')

UserSchema.path('email').validate( function(email){	
	var User = mongoose.model('User')
  	if (this.doesNotRequireValidation()){
  		return true;
  	} 
  	
  	if (this.isNew || this.isModified('email')) {  			
  			return new Promise(function(resolve, reject){  				
  				User.find({ email: email }).exec(function (err, users) {
      				if(!err && users.length === 0){
      					resolve (true)
      				}
    				reject( Error('Email already exists.') );    			
    			})  				  							 	  		  		 			
			})  						    			   
  	} else{
  		return true;
  	}
		
}, 'Email already exists.')

UserSchema.path('hashed_password').validate(function (hashed_password) {
	if (this.doesNotRequireValidation()) return true  
  	return hashed_password.length
}, 'Password cannot be blank.')

/**
 * Methods
 */
UserSchema.methods = {
	
	/**
	 * Check user role
	 * 
	 * @param {String} role
	 * @return {Boolean}
	 */
	hasRole: function(role){
		return this.roles.includes( role )		
	},
	
	/**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api public
   */
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password
  },
  
  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */
  makeSalt: function () {
    return Math.round((new Date().valueOf() * Math.random())) + ''
  },
  
  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */
  encryptPassword: function (password) {
    if (!password) return ''
    var encrypred
    try {
      encrypred = crypto.createHmac('sha1', this.salt).update(password).digest('hex')
      return encrypred
    } catch (err) {
      return ''
    }
  },
  
  gravatar: function(size) {
    if (!size) size = 200;

    if (!this.email) {
      return 'https://gravatar.com/avatar/?s=' + size + '&d=retro';
    }

    var md5 = require('crypto').createHash('md5').update(this.email).digest('hex');
    return 'https://gravatar.com/avatar/' + md5 + '?s=' + size + '&d=retro';
  },
	
  /**
   * Validation is not required if using OAuth
   */
  doesNotRequireValidation: function() {
    return ~oAuthTypes.indexOf(this.provider);
  },
  
  /**
   * Create payload for JWT token
   */
  toPayload:function(){
  	let payload = this.toJSON();	
	delete payload._id; 
	delete payload.salt;
	delete payload.hashed_password;
	delete payload.provider
	delete payload.__v
  	return payload  	
  }
}

module.exports = mongoose.model('User', UserSchema)