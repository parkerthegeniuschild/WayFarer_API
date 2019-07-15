import { config } from 'dotenv';
import { Pool } from 'pg';
// import bcrypt from 'bcrypt';
import logger from '../logs/winston';

config();

/* Create the PG pool */
const {
  PGNAME, PGHOST, PGPORT, PGUSER, PGPASSWORD,
} = process.env;

const pool = new Pool({
  host: PGHOST,
  port: PGPORT,
  user: PGUSER,
  database: PGNAME,
  password: PGPASSWORD,
  max: 20,
  idleTimeoutMillis: 2000,
  connectionTimeoutMillis: 2000,
});

pool.on('connect', () => {
  logger.info('Connected to PostgreSQL ... OK! \n');
});

pool.on('error', (err) => {
  logger.error('Unexpected error on idle client', err);
  process.exit(-1);
});


const DBQueries = {

  /**
   * Create a new user
   */
  async createUser(user) {
    const {
      email, password, first_name, last_name, is_admin,
    } = user;

    const text = 'INSERT INTO users (email, first_name, last_name, password, is_admin) VALUES($1,'
      + ' $2, $3, $4, $5) RETURNING *';
    const values = [email, first_name, last_name, password, is_admin];

    // async/await
    try {
      const res = await pool.query(text, values);

      if (res.rowCount < 1) {
        return false;
      }

      const row = res.rows[0];

      return {
        user_id: row.id,
        first_name,
        last_name,
        email,
        is_admin,
        created_on: row.created_on,
        modified_on: row.modified_on,
      };
    } catch (err) {
      logger.error(err.stack);
      return err;
    }
  },

};

export default DBQueries;
