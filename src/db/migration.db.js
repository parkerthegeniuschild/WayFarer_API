import { config } from 'dotenv';
import runnableExports from 'runnable-exports';
import { Pool } from 'pg';
import bcrypt from 'bcrypt';
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
  const password = bcrypt.hashSync('P@ssw0rd', 10);

  const query = `INSERT INTO users(first_name, last_name, email, password, is_admin) 
  VALUES ('John', 'Doe', 'johndoe@gmail.com', '${password}', 'false'), 
  ('Jane', 'Doe', 'janedoe@gmail.com', '${password}', 'true')`;

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

const createDummyTrips = () => {
  const query = 'INSERT INTO trips(bus_id, origin, destination, trip_date, fare) '
    + "VALUES ('1', 'Lagos', 'Abuja', '2019-07-30', '3547.29'),"
    + " ('2', 'Abuja', 'Lagos', '2019-07-22', '6271.19'), "
    + "('3', 'Ekiti', 'Calabar', '2019-07-10', '3000.00'), "
    + "('2', 'Benin', 'Uyo', '2019-08-30', '9811.43')";

  (async () => {
    const client = await pool.connect();
    try {
      client.query(query);
      logger.info('Inserted dummy trips successfully');
    } finally {
      client.release();
    }
  })()
    .catch(err => logger.error(err.stack));
};

const createDummyBookings = () => {
  const query = "INSERT INTO bookings(trip_id, user_id, seat_number) VALUES ('1', '1', '27'), "
    + "('2', '2', '13'), ('3', '1', '8'), ('4', '2', '12'), ('4', '1', '6')";

  (async () => {
    const client = await pool.connect();
    try {
      client.query(query);
      logger.info('Inserted dummy bookings successfully');
    } finally {
      client.release();
    }
  })()
    .catch(err => logger.error(err.stack));
};

const seedTables = () => {
  createDummyUsers();
  setTimeout(createDummyBuses, 500);
  setTimeout(createDummyTrips, 1000);
  setTimeout(createDummyBookings, 1500);
};

module.exports = {
  seedTables,
};

runnableExports();
