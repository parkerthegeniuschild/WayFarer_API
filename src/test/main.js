import { config } from 'dotenv';
import chai from 'chai';
import chaiHttp from 'chai-http';

import server from '../app';

config();

const should = chai.should();
const expect = chai.expect;

chai.use(chaiHttp);

let tokenUser;
let tokenAdmin;


describe('TESTING THE USERS ENDPOINTS', () => {

  it('should return error empty registration form', (done) => {
    const newUser = {};

    chai.request(server)
      .post('/api/v1/auth/signup')
      .set('Accept', 'application/json')
      .send(newUser)
      .end((err, res) => {
        res.should.have.status(400);
        done();
      });
  });

  it('should not create a user without a first name', (done) => {
    const newUser = {
      email: 'myfirstemail@yahoo.com',
      password: 'P@ssw0rd',
      first_name: '',
      last_name: 'World'
    };

    chai.request(server)
      .post('/api/v1/auth/signup')
      .send(newUser)
      .end((err, res) => {
        res.should.have.status(400);
        done();
      });
  });

  it('should not create a user without last a name', (done) => {
    const newUser = {
      email: 'myfirstemail@yahoo.com',
      password: 'P@ssw0rds',
      first_name: 'Hello',
      last_name: ''
    };

    chai.request(server)
      .post('/api/v1/auth/signup')
      .send(newUser)
      .end((err, res) => {
        res.should.have.status(400);
        done();
      });
  });

  it('should not accept weak passwords', (done) => {

    const newUser = {
      email: 'mysecondemail@yahoo.com',
      password: 'apple12345',
      first_name: 'Hello',
      last_name: 'World',
    };

    chai.request(server)
      .post('/api/v1/auth/signup')
      .send(newUser)
      .set('content-type', 'application/x-www-form-urlencoded')
      .end((err, res) => {
        res.should.have.status(400);
        done();
      });
  });

  it('should create an admin if they can decode the salt (although impossible)', (done) => {

    const newAdmin = {
      email: 'myadminuser@yahoo.com',
      password: 'P@ssw0rd',
      first_name: 'Admin',
      last_name: 'User',
      secretCode: process.env.ADMIN_SECRET_CODE,
    };

    chai.request(server)
      .post('/api/v1/auth/signup')
      .send(newAdmin)
      .set('content-type', 'application/x-www-form-urlencoded')
      .end((err, res) => {
        tokenAdmin = res.body.data.token;
        const { body } = res;
        expect(res.status).to.equal(201);
        expect(res.status).to.be.a('number');
        expect(body).to.be.an('object');
        expect(body.data).to.be.have.property('token');
        expect(body.data).to.be.have.property('first_name');
        expect(body.data).to.be.have.property('last_name');
        expect(body.data).to.be.have.property('is_admin');
        expect(body.data).to.be.have.property('email');
        done();
      });
  });

  it('should create a regular user not admin)', (done) => {

    const regUser = {
      email: 'myregularuser@yahoo.com',
      password: 'P@ssw0rd',
      first_name: 'Regular',
      last_name: 'User',
    };

    chai.request(server)
      .post('/api/v1/auth/signup')
      .send(regUser)
      .set('content-type', 'application/x-www-form-urlencoded')
      .end((err, res) => {
        tokenUser = res.body.data.token;
        const { body } = res;
        expect(res.status).to.equal(201);
        expect(res.status).to.be.a('number');
        expect(body).to.be.an('object');
        expect(body.data).to.be.have.property('token');
        expect(body.data).to.be.have.property('first_name');
        expect(body.data).to.be.have.property('last_name');
        expect(body.data).to.be.have.property('is_admin');
        expect(body.data).to.be.have.property('email');
        done();
      });
  });

  it('should not create the same user twice', (done) => {

    const newUser = {
      email: 'myregularuser@yahoo.com',
      password: 'P@ssw0rd',
      first_name: 'Regular',
      last_name: 'User',
    };

    chai.request(server)
      .post('/api/v1/auth/signup')
      .send(newUser)
      .set('content-type', 'application/x-www-form-urlencoded')
      .end((err, res) => {
        res.should.have.status(403);
        done();
      });
  });

  it('should return error on empty login form', (done) => {
    const newUser = {};

    chai.request(server)
      .post('/api/v1/auth/signin')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send(newUser)
      .end((err, res) => {
        res.should.have.status(400);
        done();
      });
  });

  it('should not login without an email', (done) => {
    const user = {
      email: '',
      password: 'P@ssw0rd',
    };

    chai.request(server)
      .post('/api/v1/auth/signin')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send(user)
      .end((err, res) => {
        res.should.have.status(400);
        done();
      });
  });

  it('should not login without a password', (done) => {
    const newUser = {
      email: 'myfirstemail@yahoo.com',
      password: '',
    };

    chai.request(server)
      .post('/api/v1/auth/signin')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send(newUser)
      .end((err, res) => {
        res.should.have.status(400);
        done();
      });
  });

  it('should not login unregistered user', (done) => {
    const user = {
      email: 'unregisteremail@yahoo.com',
      password: 'P@ssw0rd',
    };

    chai.request(server)
      .post('/api/v1/auth/signin')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send(user)
      .end((err, res) => {
        res.should.have.status(401);
        done();
      });
  });

  it('should NOT login with wrong password', (done) => {
    const user = {
      email: 'myfirstemail@yahoo.com',
      password: 'P@ssw0rds'
    };

    chai.request(server)
      .post('/api/v1/auth/signin')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send(user)
      .end((err, res) => {
        res.should.have.status(401);
        done();
      });
  });

  it('should login user on correct email and password', (done) => {
    const user = {
      email: 'johndoe@gmail.com',
      password: 'P@ssw0rd'
    };

    chai.request(server)
      .post('/api/v1/auth/signin')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send(user)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

});


describe('TESTING THE BUSES ENDPOINTS', () => {

  it('Admin CAN create A BUS', (done) => {

    const bus = {
      number_plate: 'FST 78 KJA',
      manufacturer: 'Nissan',
      model: 'Roadstar',
      year: 2008,
      capacity: 45
    };

    const cValue = "token=" + tokenAdmin;

    chai.request(server)
      .post('/api/v1/buses')
      .set('content-type', 'application/x-www-form-urlencoded')
      .set('Cookie', cValue)
      .send(bus)
      .end((err, res) => {
        res.should.have.status(201);
        done();
      });
  });

  it('user cannot create A BUS', (done) => {

    const bus = {
      number_plate: 'FST 78 KJA',
      manufacturer: 'Nissan',
      model: 'Roadstar',
      year: 2008,
      capacity: 45
    };

    const cValue = "token=" + tokenUser;

    chai.request(server)
      .post('/api/v1/buses')
      .set('content-type', 'application/x-www-form-urlencoded')
      .set('Cookie', cValue)
      .send(bus)
      .end((err, res) => {
        res.should.have.status(401);
        done();
      });
  });

  it('return error on invalid bus params', (done) => {

    const bus = {
      number_plate: '',
      manufacturer: 'Nissan',
      model: 'Roadstar',
      year: '',
      capacity: 45
    };

    const cValue = "token=" + tokenAdmin;

    chai.request(server)
      .post('/api/v1/buses')
      .set('content-type', 'application/x-www-form-urlencoded')
      .set('Cookie', cValue)
      .send(bus)
      .end((err, res) => {
        res.should.have.status(400);
        done();
      });
  });

});
