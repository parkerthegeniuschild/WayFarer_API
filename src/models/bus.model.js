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

};
