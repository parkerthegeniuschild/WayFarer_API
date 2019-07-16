import chai from 'chai';
import chaiHttp from 'chai-http';

import CharCase from '../utilities/charCaseHelpers';

import dbQueries from '../db/queries.db'

const should = chai.should();
const expect = chai.expect;

chai.use(chaiHttp);

const email = 'testemail@yahoo.com';
const password = 'randompassword';
const first_name = "Test";
const last_name = 'User';

describe('TEST FUNCTIONS', () => {

  it('expect upperCaseFirst to capitalize first letter', (done) => {
    expect(CharCase.upperCaseFirst('lagos')).to.equal('Lagos');
    done();
  });

  it('expect upperCaseFirst to return string', (done) => {
    expect(CharCase.upperCaseFirst('lagos')).to.equal('Lagos');
    done();
  });

  it('expect upperCaseFirst to return false on empty string', (done) => {
    expect(CharCase.upperCaseFirst('')).to.equal(false);
    done();
  });

  it('expect upperCaseFirst to be a function', (done) => {
    CharCase.upperCaseFirst.should.be.a('function');
    done();
  });

  it('expect createUser to be false with deformed field', (done) => {

    const user = {
      email,
      password,
      first_name,
      last_name,
      is_admin: 'hello world',
    };

    expect(dbQueries.createUser(user)).to.not.equal(true);
    done();
  });

  it('expect deleteBooking to be false with deformed field', (done) => {

    const booking = {
      user_id: 1,
      is_admin: false,
      bookingId: 45
    };

    expect(dbQueries.deleteBooking(booking)).to.not.equal(true);
    done();
  });

});
