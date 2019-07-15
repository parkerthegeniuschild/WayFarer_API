import Promise from 'promise';
import db from '../db/queries.db';

export default {

  /* Create new trip */
  create: newTrip => new Promise((resolve, reject) => {
    try {
      const result = db.createTrip(newTrip);
      resolve(result);
    } catch (err) {
      reject(err);
    }
  }),

};
