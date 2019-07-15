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
            result,
          });
      })
      .catch();
  },

};
