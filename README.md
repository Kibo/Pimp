# Pimp
<img align="right" src="https://raw.githubusercontent.com/Kibo/Pimp/master/public/img/pimp_logo_200.png">

Lightweight authentication server based on [JSON Web Token](https://jwt.io/introduction/).

- Express 4
- MongoDB
- Passport
- TODO LOGGER
- Google ReCaptcha v3
- I18n

### Tool Prerequisites

- [NPM](https://npmjs.org) - Node.js package manager.
- [Grunt](http://gruntjs.com/) - The JavaScript Task Runner.

## Install
```
  $ git clone https://github.com/Kibo/Pimp.git
  $ cd Pimp
  $ npm install 
  $ grunt
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
	 	"username": "john",
    	"password": "hashed_password"
	}
}

RESPONSE:{
	status:200,
	header:{
		Content-Type:application/json
	},
	body:{		
		token:"1234.4567.78910"
	}
}
```

### POST /api/v1/refresh
```
REQUEST:{
	Header:{
		Content-Type:application/json
		Accept:application/json

	},
	Body:{
	 	token:"1234.5678.9101112" 
	}
}

RESPONSE:{
	status:200,
	header:{
		Content-Type:application/json
	},
	body:{		
		token:"13141516.17181920.21222324"
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
		data:{
		    userId: "12345",
		    firstname:"John",
		    lastname:"Deen"
		    email:"deen@email.com",
		    roles:["role1", "role2"],
		    isActive:Boolean,
		    isNotification:Boolean
		}
    },
    sign:"hash-123456"
}
```

### TODO
- Add Captcha to login, reset, signup forms
- Create a temporary password if password reset.

