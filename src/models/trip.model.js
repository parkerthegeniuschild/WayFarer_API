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

  /* Get all trips */
  getAll: filters => new Promise((resolve, reject) => {
    try {
      const result = db.getAllTrips(filters);
      resolve(result);
    } catch (err) {
      reject(err);
    }
  }),

  /* Cancel a trip */
  cancel: trip_id => new Promise((resolve, reject) => {
    try {
      const result = db.cancelTrip(trip_id);
      resolve(result);
    } catch (err) {
      reject(err);
    }
  }),

};
