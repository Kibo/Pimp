const config 			= require('./config');
const logger           = require('morgan');
const path             = require('path');
const responseTime     = require('response-time');
const methodOverride   = require('method-override');
const compression      = require('compression');
const favicon          = require('serve-favicon');
const bodyParser       = require('body-parser');
const cookieParser     = require('cookie-parser');
const session          = require('express-session');
const MongoStore       = require('connect-mongo')(session);
const errorHandler     = require('errorhandler');
const _                = require('underscore');
const i18n				= require("i18n");
const engine 			= require('ejs-mate');
const env				= process.env.NODE_ENV || 'development';
const pkg				= require('../../package.json');
const flash				= require('express-flash');
const routes			= require('../routes');
const Form = require(config.root + '/app/models/form');

module.exports = function (app, express, passport, mongoose) {
	
	var allowCrossDomain = function(req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header('Access-Control-Allow-Credentials', true)
		res.header("Access-Control-Allow-Headers", "X-Requested-With");
		next();
	};
  	
  // settings
  app.set('env', env);
  app.set('port', app.config.server.port || 3000);
  
  // use ejs-locals for all ejs templates:
  app.engine('ejs', engine);     
  app.set('views', path.join( app.config.root, '/app/views'));
  app.set('view engine', 'ejs');
  
  app.disable('x-powered-by');
  
  // Express use middlewares
  app.use(favicon(path.join(app.config.root, 'public/favicon.png')));
  app.use(allowCrossDomain);
  
  if (env === 'development') {
  	app.use(logger('dev'))
  } else {
  	app.use(logger())
  };
         
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(methodOverride()); 
      
  app.use(cookieParser());
  app.use(session({  	
    secret: pkg.name, 
    resave: false,
    saveUninitialized: true,   
    store: new MongoStore({ mongooseConnection: mongoose.connection })
  }));
  
  // Locales
	i18n.configure({
    	locales:['en', 'cs'],
    	defaultLocale: 'en',
    	directory: app.config.root + '/app/locales'
	});	
	app.use(i18n.init);
    
  // use passport session
  app.use(passport.initialize());
  app.use(passport.session({ maxAge: new Date(Date.now() + 60) }));
  
  app.use(flash());
  
  app.use(function (req, res, next) {
		res.locals.config      = config;
    	res.locals.NODE_ENV = env;
    	res.locals.form = new Form();    	    
    	if(_.isObject(req.user)) {
      		res.locals.User = req.user
    	}  	    
    	next()
  });
  
  app.use(express.static(path.join(app.config.root, 'public')));
  
   /** ROUTES Apps */
  app.use(routes);
  
  // will print stacktrace
  if (app.get('env') === 'development') {
    app.use(responseTime());
  } else {
    app.use(compression({
      filter: function (req, res) { return /json|text|javascript|css/.test(res.getHeader('Content-Type')) },
      level: 9
    }))
  }
  
   app.use(function handleNotFound(req, res, next){
    res.status(404);

    if (req.accepts('html')) {
      res.render('404', { url: req.url, error: '404 Not found' });
      return;
    }

    if (req.accepts('json')) {
      res.send({ error: 'Not found' });
      return;
    }

    res.type('txt').send('Not found');
  })
  
	if (env === 'development') {
		app.use(errorHandler());
	}else{
		
		app.use(function logErrors(err, req, res, next){
      		if (err.status === 404) {
        		return next(err)
      		}
      		console.error(err.stack)
      		next(err)
    	})
    	
    	app.use(function respondError(err, req, res, next){
      		var status, message

      		status = err.status || 500;
      		res.status(status);

      		message = ((err.productionMessage && err.message) || err.customProductionMessage)

      		if (!message) {
        		if (status === 403) {
          			message = 'Not allowed'
        		} else {
          			message = 'Oops, there was a problem!'
        		}
      		}

      		if (req.accepts('json')) {
        		res.send({error: message})
        		return

      		} else {
        		res.type('txt').send(message + '\n')
        		return
      		}
    	})	
	}	
}