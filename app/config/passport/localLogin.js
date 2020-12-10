var mongoose         = require('mongoose')
var LocalStrategy    = require('passport-local').Strategy
var User             = mongoose.model('User')

module.exports = function(passport){
  // use local strategy
  passport.use( new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    
    function(req, email, password, done) {    
      
      // save email for login form
      req.flash('email', email);

      User.findOne( { email: email } , function (err, user) {

        if (err) {
          return done(err)
        }

        if (!user) {
          return done(null, false, {email:email, message: 'Your email not register.' })
        }

        if (!user.authenticate(password)) {
          return done(null, false, {email:email, message: 'Invalid login or password.' })
        }
        
        if (!user.isActive) {
          return done(null, user, {message: 'Your account has not been approved by an administrator yet.'})
        }

        return done(null, user)
      })
    }
  ))
}