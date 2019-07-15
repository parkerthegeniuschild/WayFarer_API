import Promise from 'promise';
import db from '../db/queries.db';

export default {

  /* Create new bus */
  create: newBus => new Promise((resolve, reject) => {
    try {
      const result = db.createBus(newBus);
      resolve(result);
    } catch (e) {
      reject(e);
    }
  }),

  /* Get all buses */
  getAll: filters => new Promise((resolve, reject) => {
    try {
      const result = db.getAllBuses(filters);
      resolve(result);
    } catch (err) {
      reject(err);
    }
  }),

};
