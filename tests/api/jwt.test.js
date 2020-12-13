const app = require('../../server')
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
const EXPIRED_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MDc1MjMzOTQsImV4cCI6MTYwNzUyNjk5NCwiaXNzIjoid3d3Lm1haWwxLmNvbSIsInVzZXIiOnsicm9sZXMiOlsibWVtYmVyIl0sImVtYWlsIjoidXNlcjFAbWFpbC5jb20iLCJpc0FjdGl2ZSI6dHJ1ZX19.ysb7ppD6UAEoPqfnoUe3TEbcp-r-buo7YDDJoNNM9-A"
const BROKEN_TOKEN =  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MDc1MjMzOTQsImV4cCI6MTYwNzUyNjk5NCwiaXNzIjoid3d3Lm1haWwxLmNvbSIsInVzZXIiOnsicm9sZXMiOlsibWVtYmVyIl0sImVtYWlsIjoidXNlcjFAbWFpbC5jb20iLCJpc0FjdGl2ZSI6dHJ1ZX19.ysb7ppD6UAEoPqfnoUe3TEbcp-r-buo7YDDJoNNM9-A-broken"

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

let token;

describe('/api/v1/login', () => {	
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
			token = res.body.accessToken				
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

describe('/api/v1/refresh', () => {
	it('Should bee refreshed', async () => {
		
		// wait for 2 seconds
		await new Promise((r) => setTimeout(r, 2000));
		
		const res = await request(app)
			.post('/api/v1/refresh')			
			.set({
				 'Accept': 'application/json',
				 'Authorization': "Bearer " + token})
			.send()
		  	
			expect(res.statusCode).toEqual(200)			
			expect(res.body.accessToken.split(".").length).toEqual(3)	
			expect(res.body.accessToken).not.toBe(token)											
	})
	
	it('Should bee expored', async () => {				
		const res = await request(app)
			.post('/api/v1/refresh')			
			.set({
				 'Accept': 'application/json',
				 'Authorization': "Bearer " + EXPIRED_TOKEN})
			.send()
		  	
			expect(res.statusCode).toEqual(403)			
			expect(res.text).toBe("jwt expired");												
	})
	
	it('Should bee broken', async () => {				
		const res = await request(app)
			.post('/api/v1/refresh')			
			.set({
				 'Accept': 'application/json',
				 'Authorization': "Bearer " + BROKEN_TOKEN})
			.send()
		  	
			expect(res.statusCode).toEqual(403)			
			expect(res.text).toBe("invalid signature");													
	})
	
	it('User change status', async () => {
		
		let user = await User.findOne( { email: EMAIL1 }).exec()
		expect(user).not.toBeNull()	
		
		user.isActive = false
		await user.save()		
						
		const res = await request(app)
			.post('/api/v1/refresh')			
			.set({
				 'Accept': 'application/json',
				 'Authorization': "Bearer " + token})
			.send()
		  	
			expect(res.statusCode).toEqual(401)			
			expect(res.text).toBe("Incorrect credentials");												
	})
	
	it('Token change status', async () => {
		
		let changedToken = await Token.findOne( { iss: ISS1 }).exec()
		expect(changedToken).not.toBeNull()
		
		changedToken.isActive = false				
		await changedToken.save()		
						
		const res = await request(app)
			.post('/api/v1/refresh')			
			.set({
				 'Accept': 'application/json',
				 'Authorization': "Bearer " + token})
			.send()
		  	
			expect(res.statusCode).toEqual(401)			
			expect(res.text).toBe("Incorrect credentials");												
	})
})
