# Pimp
<img align="right" src="https://raw.githubusercontent.com/Kibo/Pimp/master/public/img/pimp_logo_200.png">

Lightweight authentication server based on [JSON Web Token](https://jwt.io/introduction/). 
It contains users management, tokens management, logging. 

## Version
- 0.9.0 ( testing )

### Workers
- Node (currently: v12.18.2)
- Express 4
- MongoDB
- Passport
- Google ReCaptcha v3
- I18n

### Tools

- [NPM](https://npmjs.org) - Node.js package manager.
- [Grunt](http://gruntjs.com/) - The JavaScript Task Runner.

### Before install
- pls, see [config.js](https://github.com/Kibo/Pimp/blob/master/app/config/config.js). Especially **the database section**.

### Install
```
	$ git clone https://github.com/Kibo/Pimp.git
	$ cd Pimp
	$ npm install 
	$ npm start
```
### First login
- localhost:3000/init  
- localhost:3000/login
- admin@admin.com
- 1234

Note:
- Delete [init path](https://github.com/Kibo/Pimp/blob/master/app/routes/index.js#L23) after first login. It creates admin.
- Don't delete local token. You couldn't sign in.

### Tests
```
	$ npm test 
```

## Endpoints
### POST /api/v1/login
```
REQUEST:{
	Header:{
		Content-Type:application/json
		Accept:application/json
	},
	Body:{
		"email": "deen@email.com"
		"password": "password"
		"iss":"www.klient-app.com"
	}
}

RESPONSE:{
	status:200,
	header:{
		Content-Type:application/json
	},
	body:{		
		accessToken:"1234.4567.78910"
	}
}
```

### POST /api/v1/refresh
```
REQUEST:{
	Header:{
		Content-Type:application/json
		Accept:application/json
		Authorization:Bearer [JWT_TOKEN]
	},
	Body:{}
}

RESPONSE:{
	status:200,
	header:{
		Content-Type:application/json
	},
	body:{		
		accessToken:"xxxxxxx.yyyyyyyy.zzzzzzzzz"
	}
}
```
***
### Token
```
{
	header:{
		"alg": "HS256",
		"typ": "JWT"
	},
	payload:{
		iat:"token creation time",
		iss:"domain name",
		exp:"time until is valid",
		user:{			
			firstname:"John",
			lastname:"Deen"
			email:"deen@email.com",
			roles:["role1", "role2"],
			isActive:Boolean,
			isNotification:Boolean,			
		}
    },
    signature:"zzzzzzzzz"
}
```

### TODO
- Google ReCaptcha v3 to login, reset, signup forms
- Create a temporary password if password reset.
- I18n

