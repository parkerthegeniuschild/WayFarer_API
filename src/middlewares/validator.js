import validationHelpers from '../utilities/validationHelpers';
import {
  emailRegex, busYearRegex, numberRegex,
} from '../utilities/regexen';

const { checkForEmptyFields, checkPatternedFields } = validationHelpers;

export default {
  auth: (req, res, next) => {
    const errors = [];
    const {
      first_name, last_name, email, password,
    } = req.body;

    if (req.path.includes('signup')) {
      errors.push(...checkForEmptyFields('First Name', first_name));
      errors.push(...checkForEmptyFields('Last Name', last_name));
      errors.push(...checkPatternedFields('Email Address', email, emailRegex));
      errors.push(...checkForEmptyFields('Password', password));
    } else if (req.path.includes('signin')) {
      errors.push(...checkPatternedFields('Email Address', email, emailRegex));
      errors.push(...checkForEmptyFields('Password', password));
    }

    if (errors.length) {
      return res.status(400).json({
        status: 'error',
        error: errors,
      });
    }
    return next();
  },

  bus: (req, res, next) => {
    const errors = [];

    const {
      number_plate, manufacturer, model, year, capacity,
    } = req.body;

    if (req.path.includes('buses')) {
      errors.push(...checkForEmptyFields('Number Plate', number_plate));
      errors.push(...checkForEmptyFields('Manufacturer', manufacturer));
      errors.push(...checkForEmptyFields('Model', model));
      errors.push(...checkPatternedFields('Year', year, busYearRegex));
      errors.push(...checkPatternedFields('Capacity', capacity, numberRegex));
    }

    if (errors.length) {
      return res.status(400).json({
        status: 'error',
        error: errors,
      });
    }

    return next();
  },

  trip: (req, res, next) => {
    const errors = [];

    const {
      bus_id, origin, destination, trip_date, fare,
    } = req.body;

    if (req.path.includes('trips')) {
      errors.push(...checkForEmptyFields('Bus ID', bus_id, numberRegex));
      errors.push(...checkForEmptyFields('Origin', origin));
      errors.push(...checkForEmptyFields('Destination', destination));
      errors.push(...checkForEmptyFields('Trip Date', trip_date));
      errors.push(...checkForEmptyFields('Fare', fare));
    }

    if (errors.length) {
      return res.status(400).json({
        status: 'error',
        error: errors,
      });
    }
    return next();
  },

  checkId: (req, res, next) => {
    const errors = [];

    const { tripId, bookingId } = req.params;

    if (req.path.includes('trips')) {
      errors.push(...checkPatternedFields('Trip ID', tripId, numberRegex));
    } else {
      errors.push(...checkPatternedFields('Booking ID', bookingId, numberRegex));
    }

    if (errors.length) {
      return res.status(400).json({
        status: 'error',
        error: errors,
      });
    }

    if (typeof tripId !== 'undefined') {
      req.body.trip_id = tripId;
    }

    if (typeof bookingId !== 'undefined') {
      req.body.bookingId = bookingId;
    }

    return next();
  },

  booking: (req, res, next) => {
    const errors = [];

    const { trip_id, seat_number } = req.body;

    if (req.path.includes('bookings')) {
      if (typeof seat_number !== 'undefined') {
        errors.push(...checkPatternedFields('Seat Number', seat_number, numberRegex));
      }

      errors.push(...checkPatternedFields('Trip ID', trip_id, numberRegex));
    }

    if (errors.length) {
      return res.status(400).json({
        status: 'error',
        error: errors,
      });
    }

    return next();
  },

};
