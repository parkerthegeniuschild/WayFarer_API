import Promise from 'promise';
import db from '../db/queries.db';

export default {

  /* Create new booking */
  create: newBooking => new Promise((resolve, reject) => {
    try {
      const result = db.createBooking(newBooking);
      resolve(result);
    } catch (err) {
      reject(err);
    }
  }),

  getOne: id => new Promise((resolve, reject) => {
    try {
      const result = db.getOneBooking(id);
      resolve(result);
    } catch (err) {
      reject(err);
    }
  }),

};
