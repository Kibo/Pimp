# Pimp
<img align="right" src="https://raw.githubusercontent.com/Kibo/Pimp/master/public/img/pimp_logo_200.png">

Lightweight authentication server based on [JSON Web Token](https://jwt.io/introduction/). 
It contains users management, tokens management, logging. 

## Support

<a href="https://www.buymeacoffee.com/Kibo" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: 41px !important;width: 174px !important;box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;" ></a>

## Version
- 1.1.0

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

### Docker

[pimp in Docker hub](#)

### Env-variable
|Env-variable|Description|
|--- |--- |
|`HOST_NAME`|The hostname, if not provided the default **localhost** will be used|
|`DB_USERNAME`|The username for the database connection, if not provided it does not use authentication.|
|`DB_PASSWORD`|The password for the database user|
|`DB_HOST`|The host IP address or DNS name without the port! If not provided the default **localhost** will be used|
|`DB_PORT`|The port of the mongoDB database, if not provided the default **27017** will be used|
|`DB_NAME`|The name of the database, if not provided the default **pimp** will be used|

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
- I18n

