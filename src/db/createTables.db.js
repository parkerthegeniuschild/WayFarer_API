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
  idleTimeoutMillis: 5000,
  connectionTimeoutMillis: 2000,
});

pool.on('connect', () => {
  logger.info('Connected to PostgreSQL successfully');
});


/**
 * Create User Table
 */
const createUsersTable = () => {
  const queryText = `CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_on TIMESTAMP WITHOUT TIME ZONE DEFAULT (now() AT TIME ZONE 'WAT'),
        modified_on TIMESTAMP WITHOUT TIME ZONE,
        is_admin BOOLEAN NOT NULL
      )`;

  (async () => {
    const client = await pool.connect();
    try {
      client.query(queryText);
      logger.info('Table \'users\' created successfully');
    } finally {
      client.release();
    }
  })().catch(err => logger.error(err.stack));
};


/**
 * Create Bus Table
 */
const createBusesTable = () => {
  const queryText = `CREATE TABLE IF NOT EXISTS buses(
        id SERIAL PRIMARY KEY,
        number_plate VARCHAR(10) NOT NULL,
        model TEXT NOT NULL,
        year INT NOT NULL,
        manufacturer TEXT NOT NULL,
        capacity INT NOT NULL,
        created_on TIMESTAMP WITHOUT TIME ZONE DEFAULT (now() AT TIME ZONE 'WAT'),
        modified_on TIMESTAMP WITHOUT TIME ZONE
      )`;

  (async () => {
    const client = await pool.connect();
    try {
      client.query(queryText);
      logger.info('Table \'buses\' created successfully');
    } finally {
      client.release();
    }
  })().catch(err => logger.error(err.stack));
};


/**
 * Create Trips Table
 */
const createTripsTable = () => {
  const queryText = `CREATE TABLE IF NOT EXISTS trips(
        id SERIAL PRIMARY KEY,
        bus_id INT REFERENCES buses(id) ON DELETE CASCADE,
        origin TEXT NOT NULL,
        destination TEXT NOT NULL,
        trip_date DATE NOT NULL,
        fare FLOAT(2) NOT NULL,
        status VARCHAR(10) DEFAULT 'active'
      )`;

  (async () => {
    const client = await pool.connect();
    try {
      client.query(queryText);
      logger.info('Table \'trips\' created successfully');
    } finally {
      client.release();
    }
  })().catch(err => logger.error(err.stack));
};


/**
 * Create Bookings Table
 */
const createBookingsTable = () => {
  const queryText = `CREATE TABLE IF NOT EXISTS bookings(
        id SERIAL,
        trip_id INT REFERENCES trips(id) ON DELETE CASCADE,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        seat_number SERIAL,
        created_on TIMESTAMP WITHOUT TIME ZONE DEFAULT (now() AT TIME ZONE 'WAT'),
        modified_on TIMESTAMP WITHOUT TIME ZONE,
        PRIMARY KEY(trip_id, user_id)
      )`;

  (async () => {
    const client = await pool.connect();
    try {
      client.query(queryText);
      logger.info('Table \'bookings\' created successfully');
    } finally {
      client.release();
    }
  })().catch(err => logger.error(err.stack));
};


/**
 * Drop User Table
 */
const dropUsersTable = () => {
  const queryText = 'DROP TABLE IF EXISTS users;';

  (async () => {
    const client = await pool.connect();
    try {
      client.query(queryText);
      logger.info('Table \'users\' dropped successfully');
    } finally {
      client.release();
    }
  })().catch(err => logger.error(err.stack));
};

/**
 * Drop Buses Table
 */
const dropBusesTable = () => {
  const queryText = 'DROP TABLE IF EXISTS buses;';

  (async () => {
    const client = await pool.connect();
    try {
      client.query(queryText);
      logger.info('Table \'buses\' dropped successfully');
    } finally {
      client.release();
    }
  })().catch(err => logger.error(err.stack));
};


/**
 * Drop Trips Table
 */
const dropTripsTable = () => {
  const queryText = 'DROP TABLE IF EXISTS trips;';

  (async () => {
    const client = await pool.connect();
    try {
      client.query(queryText);
      logger.info('Table \'trips\' dropped successfully');
    } finally {
      client.release();
    }
  })().catch(err => logger.error(err.stack));
};

/**
 * Drop Trips Table
 */
const dropBookingsTable = () => {
  const queryText = 'DROP TABLE IF EXISTS bookings;';

  (async () => {
    const client = await pool.connect();
    try {
      client.query(queryText);
      logger.info('Table \'bookings\' dropped successfully');
    } finally {
      client.release();
    }
  })().catch(err => logger.error(err.stack));
};


/**
 * Create All Tables && prevent deadlock
 */
const createAllTables = () => {
  createUsersTable();
  setTimeout(createBusesTable, 500);
  setTimeout(createTripsTable, 1000);
  setTimeout(createBookingsTable, 1500);
};


/**
 * Drop All Tables && prevent deadlock
 */
const dropAllTables = () => {
  dropBookingsTable();
  setTimeout(dropUsersTable, 500);
  setTimeout(dropTripsTable, 1000);
  setTimeout(dropBusesTable, 1500);
};


module.exports = {
  createAllTables,
  dropAllTables,
};

runnableExports();
