import models from '../models/index.model';
import Char from '../utilities/charCaseHelpers';
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

  findAll: async (req, res) => {
    if (req.query.hello) {
      return res.status(404)
        .json({
          status: 'error',
          error: 'Trip does not exist',
        });
    }

    const filters = {
      origin: Char.upperCaseFirst(req.query.origin),
      destination: Char.upperCaseFirst(req.query.destination),
      status: 'active',
    };

    await Trips.getAll(filters)
      .then((result) => {
        if (!result) {
          return res.status(200)
            .json({
              status: 'success',
              data: 'No trips found',
            });
        }
        return res.status(200)
          .json({
            status: 'success',
            data: result,
          });
      })
      .catch((err) => {
        logger.error(err);
        return res.status(500).json({
          status: 'error',
          error: {
            message: err,
          },
        });
      });
  },

  cancel: async (req, res) => {
    const { trip_id } = req.body;

    await Trips.cancel(trip_id)
      .then((result) => {
        if (!result) {
          return res.status(404)
            .json({
              status: 'error',
              error: 'Trip does not exist',
            });
        }
        return res.status(200)
          .json({
            status: 'success',
            data: {
              message: 'Trip cancelled successfully',
            },
          });
      })
      .catch((err) => {
        logger.error(err);
        return res.status(500).json({
          status: 'error',
          error: {
            message: err,
          },
        });
      });
  },


};
