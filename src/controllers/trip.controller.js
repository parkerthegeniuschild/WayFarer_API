import models from '../models/index.model';
// import Char from '../utilities/charCaseHelpers';
import logger from '../logs/winston';

const { Trips } = models;

export default {
  create: async (req, res) => {
    const {
      bus_id, origin, destination, fare, trip_date,
    } = req.body;


    const trip = {
      bus_id,
      origin,
      destination,
      fare,
      trip_date,
    };


    // persist trip to database
    await Trips.create(trip)
      .then((result) => {
        if (result.name === 'error') {
          return res.status(400)
            .json({
              status: 'error',
              error: 'Error: Cannot create trip for nonexistent bus.',
            });
        }

        return res.status(201)
          .json({
            status: 'success',
            data: result,
          });
      })
      .catch(err => logger.error(err));
  },

};
