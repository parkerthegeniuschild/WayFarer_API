import validationHelpers from '../utilities/validationHelpers';
import {
  emailRegex, passwordRegex, busYearRegex, numberRegex,
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
      errors.push(...checkPatternedFields('Password', password, passwordRegex));
    } else if (req.path.includes('signin')) {
      errors.push(...checkPatternedFields('Email Address', email, emailRegex));
      errors.push(...checkPatternedFields('Password', password, passwordRegex));
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
      errors.push(...checkPatternedFields('Bus ID', bus_id, numberRegex));
      errors.push(...checkForEmptyFields('Origin', origin));
      errors.push(...checkForEmptyFields('Destination', destination));
      errors.push(...checkForEmptyFields('Trip Date', trip_date));
      errors.push(...checkForEmptyFields('Fare', fare));
    }

    if (errors.length) {
      return res.status(400).json({
        status: 'error',
        message: errors,
      });
    }
    return next();
  },

};
