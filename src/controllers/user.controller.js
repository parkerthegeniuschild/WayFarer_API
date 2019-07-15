import { config } from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import models from '../models/index.model';
import logger from '../logs/winston';

config();
const { Users } = models;

export default {
  create: async (req, res) => {
    const {
      first_name, last_name, email, password,
    } = req.body;


    let is_admin = false;

    if (req.body.secretCode === process.env.ADMIN_SECRET_CODE) {
      is_admin = true;
    }

    const user = {
      first_name,
      last_name,
      email,
      password: await bcrypt.hashSync(password, 10),
      is_admin,
    };

    // persist user to database
    await Users.create(user)
      .then((result) => {
        if (result.name === 'error') {
          return res.status(403)
            .json({
              status: 'error',
              data: {
                message: result.detail,
              },
            });
        }

        // create token here
        const token = jwt.sign({
          user_id: result.user_id,
          is_admin,
          first_name,
          last_name,
          email,
        }, process.env.JWT_SECRET);
        res.cookie('token', token, {
          expires: new Date(Date.now() + 3600000),
          httpOnly: true,
        });

        result.token = token;

        return res.status(201)
          .json({
            status: 'success',
            data: result,
          });
      })
      .catch((err) => {
        logger.error(err);
        return res.status(500)
          .json({
            status: 'error',
            error: {
              message: err,
            },
          });
      });
  },

};
