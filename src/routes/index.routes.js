import express from 'express';

import Validator from '../middlewares/validator';
import UserController from '../controllers/user.controller';
import BusController from '../controllers/bus.controller';
import Authenticator from '../middlewares/authenticator';
import TripController from '../controllers/trip.controller';
import BookingController from '../controllers/booking.controller';

const router = express.Router();

// users
router.post('/auth/signup', Validator.auth, UserController.create);
router.post('/auth/signin', Validator.auth, UserController.login);

// buses
router.post('/buses', Authenticator.checkToken,
  Authenticator.isAdmin, Validator.bus, BusController.create);
router.get('/buses', Authenticator.checkToken, BusController.findAll);

// trips
router.post('/trips', Authenticator.checkToken, Authenticator.isAdmin,
  Validator.trip, TripController.create);
router.get('/trips', TripController.findAll);
router.patch('/trips/:tripId', Authenticator.checkToken,
  Authenticator.isAdmin, Validator.checkId, TripController.cancel);

// bookings
router.post('/bookings', Authenticator.checkToken, Validator.booking, BookingController.create);


export default router;
