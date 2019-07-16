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
      .set('content-type', 'application/x-www-form-urlencoded')
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

  // later
  // it('should not accept weak passwords', (done) => {
  //
  //   const newUser = {
  //     email: 'mysecondemail@yahoo.com',
  //     password: 'apple12345',
  //     first_name: 'Hello',
  //     last_name: 'World',
  //   };
  //
  //   chai.request(server)
  //     .post('/auth/signup')
  //     .send(newUser)
  //     .set('content-type', 'application/x-www-form-urlencoded')
  //     .end((err, res) => {
  //       res.should.have.status(400);
  //       done();
  //     });
  // });

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
        expect(body.data).to.be.have.property('first_name');
        expect(body.data).to.be.have.property('last_name');
        expect(body.data).to.be.have.property('is_admin');
        expect(body.data).to.be.have.property('email');
        expect(body.data).to.be.have.property('token');
        done();
      });
  });

  it('should create a regular user not admin)', (done) => {

    console.log('User: ', tokenUser);
    console.log('Admin: ', tokenAdmin);

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

    const tValue = `Bearer ${tokenAdmin}`;

    chai.request(server)
      .post('/api/v1/buses')
      .set('content-type', 'application/x-www-form-urlencoded')
      .set('Authorization', tValue)
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

    const tValue = `Bearer ${tokenUser}`;

    chai.request(server)
      .post('/api/v1/buses')
      .set('content-type', 'application/x-www-form-urlencoded')
      .set('Authorization', tValue)
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

    const tValue = `Bearer ${tokenAdmin}`;

    chai.request(server)
      .post('/api/v1/buses')
      .set('content-type', 'application/x-www-form-urlencoded')
      .set('Authorization', tValue)
      .send(bus)
      .end((err, res) => {
        res.should.have.status(400);
        done();
      });
  });

  it('bus route is protected unless logged in', (done) => {

    const tValue = `Bearer ${tokenAdmin}`;

    chai.request(server)
      .get('/api/v1/buses')
      .set('Authorization', tValue)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

});

describe('TESTING THE TRIPS ENDPOINTS', () => {

  it('Admin can create a trip', (done) => {

    const trip = {
      bus_id: 3,
      origin: 'Lagos',
      destination: 'Port Harcourt',
      trip_date: '2019-05-21',
      fare: 7500.13,
    };

    const tValue = `Bearer ${tokenAdmin}`;

    chai.request(server)
      .post('/api/v1/trips')
      .set('content-type', 'application/x-www-form-urlencoded')
      .set('Authorization', tValue)
      .send(trip)
      .end((err, res) => {
        res.should.have.status(201);
        done();
      });
  });

  it('return error on invalid trip params', (done) => {

    const trip = {
      bus_id: 3,
      origin: '',
      destination: 'Port Harcourt',
      trip_date: '',
      fare: 7500.13,
    };

    const tValue = `Bearer ${tokenAdmin}`;

    chai.request(server)
      .post('/api/v1/trips')
      .set('content-type', 'application/x-www-form-urlencoded')
      .set('Authorization', tValue)
      .send(trip)
      .end((err, res) => {
        res.should.have.status(400);
        done();
      });
  });

  it('cannot create trip for non existing bus', (done) => {

    const trip = {
      bus_id: 99, // since we don't have 9 yet
      origin: 'Lagos',
      destination: 'Port Harcourt',
      trip_date: '2019-05-21',
      fare: 7500.13,
    };

    const tValue = `Bearer ${tokenAdmin}`;

    chai.request(server)
      .post('/api/v1/trips')
      .set('content-type', 'application/x-www-form-urlencoded')
      .set('Authorization', tValue)
      .send(trip)
      .end((err, res) => {
        res.should.have.status(400);
        done();
      });
  });

  it('can get all trips', (done) => {

    const tValue = `Bearer ${tokenUser}`;

    chai.request(server)
      .get('/api/v1/trips')
      .set('content-type', 'application/x-www-form-urlencoded')
      .set('Authorization', tValue)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  it('can get all trips based on origin', (done) => {

    const filter = {
      origin: 'Lagos',
    };

    const tValue = `Bearer ${tokenUser}`;

    chai.request(server)
      .get('/api/v1/trips')
      .set('content-type', 'application/x-www-form-urlencoded')
      .set('Authorization', tValue)
      .query(filter)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  it('can get all trips based on destination', (done) => {

    const filter = {
      destination: 'Uyo',
    };

    const tValue = `Bearer ${tokenUser}`;

    chai.request(server)
      .get('/api/v1/trips')
      .set('content-type', 'application/x-www-form-urlencoded')
      .set('Authorization', tValue)
      .query(filter)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  it('Admin can cancel trip', (done) => {

    const tripId = 1;

    const tValue = `Bearer ${tokenAdmin}`;

    chai.request(server)
      .patch(`/api/v1/trips/${tripId}`)
      .set('Authorization', tValue)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  it('Admin cannot cancel a nonexistent trip', (done) => {

    const tripId = 99;

    const tValue = `Bearer ${tokenAdmin}`;

    chai.request(server)
      .patch(`/api/v1/trips/${tripId}`)
      .set('Authorization', tValue)
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });

  it('trip to be cancelled must be valid', (done) => {

    const tripId = '099';

    const tValue = `Bearer ${tokenAdmin}`;

    chai.request(server)
      .patch(`/api/v1/trips/${tripId}`)
      .set('Authorization', tValue)
      .end((err, res) => {
        res.should.have.status(400);
        done();
      });
  });

  it('only Admin can cancel trips', (done) => {

    const tripId = 2;

    const tValue = `Bearer ${tokenUser}`;

    chai.request(server)
      .patch(`/api/v1/trips/${tripId}`)
      .set('Authorization', tValue)
      .end((err, res) => {
        res.should.have.status(401);
        done();
      });
  });

});

describe('TESTING THE BOOKINGS ENDPOINTS', () => {

  it('User can create a booking', (done) => {

    const booking = {
      trip_id: 3,
    };

    const tValue = `Bearer ${tokenUser}`;

    chai.request(server)
      .post('/api/v1/bookings')
      .set('content-type', 'application/x-www-form-urlencoded')
      .set('Authorization', tValue)
      .send(booking)
      .end((err, res) => {
        expect(res.status).to.equal(201);
        done();
      });
  });

  it('User cannot create a booking for a non-existent trip', (done) => {

    const booking = {
      trip_id: 400,  // assuming no 400
    };

    const tValue = `Bearer ${tokenUser}`;

    chai.request(server)
      .post('/api/v1/bookings')
      .set('content-type', 'application/x-www-form-urlencoded')
      .set('Authorization', tValue)
      .send(booking)
      .end((err, res) => {
        res.should.have.status(400);
        done();
      });
  });

  it('return error on invalid booking params', (done) => {

    const booking = {
      trip_id: '',
      seat_number: '',
    };

    const tValue = `Bearer ${tokenUser}`;

    chai.request(server)
      .post('/api/v1/bookings')
      .set('content-type', 'application/x-www-form-urlencoded')
      .set('Authorization', tValue)
      .send(booking)
      .end((err, res) => {
        res.should.have.status(400);
        done();
      });
  });

  it('Admin can get all bookings', (done) => {

    const tValue = `Bearer ${tokenAdmin}`;

    chai.request(server)
      .get('/api/v1/bookings')
      .set('Authorization', tValue)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  it('User can only get his own bookings', (done) => {

    const tValue = `Bearer ${tokenUser}`;

    chai.request(server)
      .get('/api/v1/bookings')
      .set('Authorization', tValue)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  it('User cannot delete another users\' booking', (done) => {

    const booking_id = 4; // belongs to another user

    const tValue = `Bearer ${tokenUser}`;

    chai.request(server)
      .delete(`/api/v1/bookings/${booking_id}`)
      .set('Authorization', tValue)
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });

  it('Admin can delete any booking', (done) => {

    const booking_id = 5; // belong to user

    const tValue = `Bearer ${tokenAdmin}`;

    chai.request(server)
      .delete('/api/v1/bookings/5')
      .set('Authorization', tValue)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  it('Only existing bookings can be deleted', (done) => {

    const booking_id = 20; // does not exist

    const tValue = `Bearer ${tokenAdmin}`;

    chai.request(server)
      .delete(`/api/v1/bookings/${booking_id}`)
      .set('Authorization', tValue)
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });



});
