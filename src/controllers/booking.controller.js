import models from '../models/index.model';
import logger from '../logs/winston';

const { Bookings } = models;

export default {

  /* create a new booking */
  create: async (req, res) => {
    const {
      trip_id, seat_number, user_id, token,
    } = req.body;

    const booking = {
      trip_id,
      seat_number,
      user_id,
      token,
    };

    // persist booking to database
    await Bookings.create(booking)
      .then((result) => {
        if (!result) {
          return res.status(400)
            .json({
              status: 'error',
              error: 'Booking error ... please try again later',
            });
        }

        /* affix the new booking ID so we can do a cross-query */
        booking.id = result.booking_id;
      })
      .catch(err => logger.error(err));

    /* Display the newly created booking */
    await Bookings.getOne(booking.id)
      .then((result) => {
        if (!result) {
          return res.status(400)
            .json({
              status: 'error',
              error: 'Booking error ... please try again later',
            });
        }
        return res.status(201)
          .json({
            status: 'success',
            data: result,
          });
      })
      .catch();
  },

  /* get all bookings */
  findAll: async (req, res) => {
    const { user_id, is_admin, token } = req.body;

    const user = {
      user_id,
      is_admin,
      token,
    };

    await Bookings.getAll(user)
      .then((result) => {
        if (!result) {
          return res.status(200).json({
            status: 'success',
            error: 'No bookings found',
          });
        }
        return res.status(200).json({
          status: 'success',
          data: result,
        });
      })
      .catch(err => logger.error(err));
  },

  /* delete a booking */
  delete: async (req, res) => {
    const { user_id, is_admin, bookingId } = req.body;

    const booking = {
      user_id,
      is_admin,
      bookingId,
    };

    await Bookings.delete(booking)
      .then((result) => {
        if (!result) {
          return res.status(404)
            .json({
              status: 'error',
              error: 'This booking has either been deleted or you do not have '
                + 'sufficient privileges',
            });
        }
        return res.status(200)
          .json({
            status: 'success',
            data: {
              message: 'Booking deleted successfully',
            },
          });
      })
      .catch(err => logger.error(err));
  },

};
