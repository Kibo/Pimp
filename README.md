# Pimp
<img align="right" src="https://raw.githubusercontent.com/Kibo/Pimp/master/public/img/pimp_logo_200.png">

Lightweight authentication server based on [JSON Web Token](https://jwt.io/introduction/). 
Contains users management, tokens management, logging. 

## Version
- 0.1.0 (development)

### Workers
- Express 4
- MongoDB
- Passport
- TODO LOGGER
- Google ReCaptcha v3
- I18n

### Tools

- [NPM](https://npmjs.org) - Node.js package manager.
- [Grunt](http://gruntjs.com/) - The JavaScript Task Runner.

### Install
```
  $ git clone https://github.com/Kibo/Pimp.git
  $ cd Pimp
  $ npm install 
  $ grunt
```
### Local login
- localhost:3000/login
- admin@admin.com
- 1234

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
- Logger
- Google ReCaptcha v3 to login, reset, signup forms
- Create a temporary password if password reset.
- I18n

