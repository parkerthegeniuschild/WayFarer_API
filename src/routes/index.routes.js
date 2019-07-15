import express from 'express';

import Validator from '../middlewares/validator';
import UserController from '../controllers/user.controller';

const router = express.Router();

// auth
router.post('/auth/signup', Validator.auth, UserController.create);

export default router;
