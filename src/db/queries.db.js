import { config } from 'dotenv';
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


  /**
   * Login a user
   */
  async loginUser(user) {
    const { email, password } = user;

    const text = 'SELECT * FROM users WHERE email = $1';
    const value = [email];

    try {
      const res = await pool.query(text, value);

      if (res.rowCount < 1) {
        return false;
      }

      if (!bcrypt.compareSync(password, res.rows[0].password)) {
        return 'wrong password';
      }

      const row = res.rows[0];

      return {
        user_id: row.id,
        first_name: row.first_name,
        last_name: row.last_name,
        email: row.email,
        is_admin: row.is_admin,
        created_on: row.created_on,
        modified_on: row.modified_on,
      };
    } catch (err) {
      logger.error(err.stack);
      return 'error500';
    }
  },

  /**
   * Create a new bus
   */
  async createBus(bus) {
    const {
      number_plate, manufacturer, model, year, capacity,
    } = bus;

    const text = 'INSERT INTO buses (number_plate, manufacturer, model, year, capacity) VALUES($1,'
      + ' $2, $3, $4, $5) RETURNING *';
    const values = [number_plate, manufacturer, model, year, capacity];

    try {
      const res = await pool.query(text, values);
      if (res.rows[0]) {
        return res.rows[0];
      }
      return 'error';
    } catch (err) {
      logger.error(err.stack);
      return 'error500';
    }
  },

  /**
   * Get all buses
   */
  async getAllBuses(filters) {
    const { manufacturer, model, year } = filters;

    let text;
    let values;

    if (manufacturer && !model && !year) {
      text = 'SELECT * FROM buses WHERE manufacturer = $1 LIMIT 50';
      values = [manufacturer];
    } else if (model && !manufacturer && !year) {
      text = 'SELECT * FROM buses WHERE model = $1 LIMIT 50';
      values = [model];
    } else if (year && !manufacturer && !model) {
      text = 'SELECT * FROM buses WHERE year = $1 LIMIT 50';
      values = [year];
    } else if (year && manufacturer && !model) {
      text = 'SELECT * FROM buses WHERE year = $1 AND manufacturer = $2 LIMIT 50';
      values = [year, manufacturer];
    } else if (manufacturer && model && year) {
      text = 'SELECT * FROM buses WHERE manufacturer = $1 AND model = $2 AND year = $3 LIMIT 50';
      values = [manufacturer, model, year];
    } else {
      text = 'SELECT * FROM buses LIMIT 50';
      values = [];
    }

    try {
      const res = await pool.query(text, values);
      if (res.rows) return res.rows;
    } catch (err) {
      logger.error(err.stack);
      return false;
    }
  },

  /**
   * Create a new trip
   */
  async createTrip(trip) {
    const {
      bus_id, origin, destination, fare, trip_date,
    } = trip;

    const text = 'INSERT INTO trips (bus_id, origin, destination, fare, trip_date) VALUES($1,'
      + ' $2, $3, $4, $5) RETURNING *';
    const values = [bus_id, origin, destination, fare, trip_date];

    // async/await
    try {
      const res = await pool.query(text, values);

      if (res.rowCount < 1) {
        return false;
      }

      const row = res.rows[0];

      return {
        trip_id: row.id,
        bus_id,
        origin,
        destination,
        fare,
        trip_date,
        status: row.status,
      };
    } catch (err) {
      logger.error(err.stack);
      return err;
    }
  },

  /**
   * Get all trips
   */
  async getAllTrips(filters) {
    const { status, origin, destination } = filters;

    let text;
    let values;

    if (origin) {
      text = 'SELECT * FROM trips WHERE status = $1 AND origin = $2 LIMIT 50';
      values = [status, origin];
    } else if (destination) {
      text = 'SELECT * FROM trips WHERE status = $1 AND destination = $2 LIMIT 50';
      values = [status, destination];
    } else {
      text = 'SELECT * FROM trips WHERE status = $1 LIMIT 50';
      values = [status];
    }

    try {
      const res = await pool.query(text, values);

      if (res.rowCount < 1) {
        return false;
      }

      const trips = [];

      for (let i = 0; i < res.rowCount; i += 1) {
        const row = res.rows[i];

        trips[i] = {
          trip_id: row.id,
          bus_id: row.bus_id,
          origin: row.origin,
          destination: row.destination,
          fare: row.fare,
          trip_date: row.trip_date,
          status: row.status,
        };
      }
      return trips;
    } catch (err) {
      logger.error(err.stack);
      return err;
    }
  },

  /**
   * Cancel a trip
   */
  async cancelTrip(trip_id) {
    const text = 'UPDATE trips SET status = $1 WHERE id = $2';
    const values = ['cancelled', trip_id];

    try {
      const res = await pool.query(text, values);
      return res.rowCount >= 1;
    } catch (err) {
      logger.error(err.stack);
      return err;
    }
  },

  /**
   * Create a new booking
   */
  async createBooking(booking) {
    const {
      trip_id, seat_number, user_id,
    } = booking;

    let text;
    const values = [trip_id, user_id];

    if (seat_number) {
      text = 'INSERT INTO bookings (seat_number, trip_id, user_id) '
        + 'VALUES ($1, $2, $3) RETURNING id';
      values.unshift(seat_number);
    } else {
      text = 'INSERT INTO bookings (trip_id, user_id) VALUES($1, $2) RETURNING id';
    }
    // async/await
    try {
      const res = await pool.query(text, values);

      if (res.rowCount < 1) {
        return false;
      }

      const row = res.rows[0];

      return {
        booking_id: row.id,
      };
    } catch (err) {
      logger.error(err.stack);
      return err;
    }
  },

  /**
   * Get one booking
   */
  async getOneBooking(id) {
    const text = `SELECT bookings.id, bookings.user_id, bookings.trip_id, trips.bus_id, 
      trips.trip_date,bookings.seat_number, users.first_name, users.last_name, users.email 
      FROM bookings JOIN trips ON bookings.trip_id = trips.id JOIN users ON 
      bookings.user_id = users.id WHERE bookings.id = $1`;
    const values = [id];

    try {
      const res = await pool.query(text, values);

      if (res.rowCount < 1) {
        return false;
      }

      const row = res.rows[0];

      return {
        booking_id: id,
        user_id: row.user_id,
        trip_id: row.trip_id,
        bus_id: row.bus_id,
        trip_date: row.trip_date,
        seat_number: row.seat_number,
        first_name: row.first_name,
        last_name: row.last_name,
        email: row.email,
      };

      // return res.rows[0];
    } catch (err) {
      logger.error(err.stack);
      return err;
    }
  },

  /**
   * Get all bookings
   */
  async getAllBookings(user) {
    const { user_id, is_admin } = user;

    let text;
    let values;

    if (is_admin) {
      text = 'SELECT bookings.id, bookings.user_id, bookings.trip_id, trips.bus_id,'
        + ' trips.trip_date,bookings.seat_number, users.first_name, users.last_name, users.email'
        + ' FROM bookings JOIN trips ON bookings.trip_id = trips.id JOIN users ON'
        + ' bookings.user_id = users.id';
      values = [];
    } else {
      text = 'SELECT bookings.id, bookings.user_id, bookings.trip_id, trips.bus_id,'
        + ' trips.trip_date, bookings.seat_number, users.first_name, users.last_name, users.email'
        + ' FROM bookings JOIN trips ON bookings.trip_id = trips.id JOIN users ON'
        + ' bookings.user_id = users.id WHERE users.id = $1';
      values = [user_id];
    }

    try {
      const res = await pool.query(text, values);

      if (res.rowCount < 1) {
        return false;
      }

      const bookings = [];

      for (let i = 0; i < res.rowCount; i += 1) {
        const row = res.rows[i];

        bookings[i] = {
          booking_id: row.id,
          user_id: row.user_id,
          trip_id: row.trip_id,
          bus_id: row.bus_id,
          trip_date: row.trip_date,
          seat_number: row.seat_number,
          first_name: row.first_name,
          last_name: row.last_name,
          email: row.email,
        };
      }
      return bookings;
    } catch (err) {
      logger.error(err.stack);
      return err;
    }
  },

};

export default DBQueries;
