import jwt from 'jsonwebtoken';

export default {
  checkToken: (req, res, next) => {
    const authorization = req.headers.authorization;
    let token;


    if (typeof authorization !== 'undefined' && authorization.includes('Bearer')) {
      token = authorization.replace('Bearer ', '');
    } else {
      token = req.body.token;
    }

    if (typeof token === 'undefined') {
      return res.status(403).json({
        status: 'error',
        error: 'You must be logged in to proceed',
      });
    }

    try {
      req.user = jwt.decode(token, process.env.JWT_SECRET);

      const {
        user_id, is_admin, first_name, last_name, email,
      } = req.user;

      /* pipe the token details into the request body */
      req.body.user_id = user_id;
      req.body.is_admin = is_admin;
      req.body.first_name = first_name;
      req.body.last_name = last_name;
      req.body.email = email;

      return next();
    } catch (error) {
      return res.status(400).json({
        status: 'error',
        error: 'Authentication failed!',
      });
    }
  },

  isAdmin: (req, res, next) => {
    const { is_admin } = req.body;

    if (is_admin !== true) {
      return res.status(401).json({
        status: 'error',
        error: 'Auth Error: Only Admins can perform this operation',
      });
    }
    return next();
  },
};
