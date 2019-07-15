import express from 'express';

import Validator from '../middlewares/validator';
import UserController from '../controllers/user.controller';

const router = express.Router();

// auth
router.post('/auth/signup', Validator.auth, UserController.create);
router.post('/auth/signin', Validator.auth, UserController.login);

export default router;
