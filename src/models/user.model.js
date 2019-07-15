import Promise from 'promise';
import db from '../db/queries.db';


export default {

  /* Create user account */
  create: newUser => new Promise((resolve, reject) => {
    try {
      const result = db.createUser(newUser);
      resolve(result);
    } catch (e) {
      reject(e);
    }
  }),

};
