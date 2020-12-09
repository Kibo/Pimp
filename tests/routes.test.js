const app = require('../server')
const request = require('supertest')

describe('Token Endpoints', () => {
	
  it('should get a token', async () => {
    const res = await request(app)
      .post('/api/v1/login')
      .send({
      	"email":"user@mail.com",
      	"password":"123456",
      	"iss":"www.mail.com",
      	})
    expect(res.statusCode).toEqual(200)
    expect(response.body.accesstoken).toBe('pass!')
    done()    
  })
})