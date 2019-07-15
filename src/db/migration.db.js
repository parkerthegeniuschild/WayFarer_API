import { config } from 'dotenv';
import runnableExports from 'runnable-exports';
import { Pool } from 'pg';
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

const createDummyUsers = () => {
  const query = 'INSERT INTO users(first_name, last_name, email, password, is_admin) '
    + 'VALUES (\'John\', \'Doe\', \'johndoe@gmail.com\','
    + ' \'$2b$10$.DxwEMitLPOSEeWCY5lF0OVobGRKcOEIvxZuEwkbDCGE6SJGSY/KG\', \'false\'),'
    + ' (\'Jane\', \'Doe\', \'janedoe@gmail.com\','
    + ' \'$2b$10$.DxwEMitLPOSEeWCY5lF0OVobGRKcOEIvxZuEwkbDCGE6SJGSY/KG\', \'true\')';

  (async () => {
    const client = await pool.connect();
    try {
      client.query(query);
      logger.info('Inserted dummy users successfully');
    } finally {
      client.release();
    }
  })()
    .catch(err => logger.error(err.stack));
};

const createDummyBuses = () => {
  const query = 'INSERT INTO buses(number_plate, manufacturer, model, year, capacity) '
    + "VALUES ('FST 78 KJA', 'Nissan', 'Roadster', '2015', '45'),"
    + " ('AGL 63 ISK', 'Toyota', 'Tacoma', '2018', '55'), ('BCD 77 AJS', 'Ford', 'Lumin', '2012',"
    + " '65'), ('ZLS 81 SJS', 'Hyundai', 'Hayabusa', '2020', '33')";

  (async () => {
    const client = await pool.connect();
    try {
      client.query(query);
      logger.info('Inserted dummy buses successfully');
    } finally {
      client.release();
    }
  })()
    .catch(err => logger.error(err.stack));
};

const seedTables = () => {
  createDummyUsers();
  setTimeout(createDummyBuses, 500);
};

module.exports = {
  seedTables,
};

runnableExports();
