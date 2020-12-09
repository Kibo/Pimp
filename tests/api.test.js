const app = require('../server')
const request = require('supertest')

const mongoose = require('mongoose');
const User = mongoose.model('User');
const Token = mongoose.model('Token');

const EMAIL1 = "user1@mail.com"
const EMAIL2 = "user2@mail.com"
const PASS = "1234"
const ISS1 = "www.mail1.com"
const ISS2 = "www.mail2.com"
const TOKEN_SECRET = "s8cr5t"

describe('/api/v1/login', () => {
	
	beforeAll ( async function(done){    
		await new User({email:EMAIL1, password:PASS, roles:['member'], isActive:true, isNotification:true}).save()   
		await new User({email:EMAIL2, password:PASS, roles:['member'], isActive:false, isNotification:true}).save()
		await new Token({isActive:true, secret:TOKEN_SECRET, iss:ISS1}).save()
		await new Token({isActive:false, secret:TOKEN_SECRET, iss:ISS2}).save()
		done()
	});	

	afterAll (async function(done){
		await User.deleteMany({});   
		await Token.deleteMany({}); 
		
		 
		done()
	});
	
		
	it('Should get a token', async () => {
		const res = await request(app)
			.post('/api/v1/login')
			.send({
				"email":EMAIL1,
				"password":PASS,
				"iss":ISS1,
		  	})
		  	
			expect(res.statusCode).toEqual(200)			
			expect(res.body.accessToken.split(".").length).toEqual(3)				 
	})
	
	it('Missing credentials - iss', async () => {
		const res = await request(app)
			.post('/api/v1/login')
			.send({
				"email":EMAIL1,
				"password":PASS,				
		  	})
		  	
			expect(res.statusCode).toEqual(401)			
			expect(res.text).toBe("Missing credentials");				 
		})
		
		
	it('Incorrect credentials - bad password', async () => {
		const res = await request(app)
			.post('/api/v1/login')
			.send({
				"email":EMAIL1,
				"password":"badPassword",
				"iss":ISS1,
		  	})
		  			  			  			 
			expect(res.statusCode).toEqual(401)			
			expect(res.text).toBe("Incorrect credentials");				 
		})
	it('Incorrect credentials - bad iss', async () => {
		const res = await request(app)
			.post('/api/v1/login')
			.send({
				"email":EMAIL1,
				"password":PASS,
				"iss":"www.google.com",
		  	})
		  			  			  			 
			expect(res.statusCode).toEqual(401)			
			expect(res.text).toBe("Incorrect credentials");				 
		})
		
	it('Incorrect credentials - token is not active', async () => {
		const res = await request(app)
			.post('/api/v1/login')
			.send({
				"email":EMAIL1,
				"password":PASS,
				"iss":ISS2,
		  	})
		  			  			  			 
			expect(res.statusCode).toEqual(401)			
			expect(res.text).toBe("Incorrect credentials");				 
		})
		
	it('Incorrect credentials - user is not active', async () => {
		const res = await request(app)
			.post('/api/v1/login')
			.send({
				"email":EMAIL2,
				"password":PASS,
				"iss":ISS2,
		  	})
		  			  			  			 
			expect(res.statusCode).toEqual(401)			
			expect(res.text).toBe("Incorrect credentials");				 
		})				
})