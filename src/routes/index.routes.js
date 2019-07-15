import express from 'express';

import Validator from '../middlewares/validator';
import UserController from '../controllers/user.controller';
import BusController from '../controllers/bus.controller';
import Authenticator from '../middlewares/authenticator';

const router = express.Router();

// users
router.post('/auth/signup', Validator.auth, UserController.create);
router.post('/auth/signin', Validator.auth, UserController.login);

// buses
router.post('/buses', Authenticator.checkToken,
  Authenticator.isAdmin, Validator.bus, BusController.create);


export default router;
