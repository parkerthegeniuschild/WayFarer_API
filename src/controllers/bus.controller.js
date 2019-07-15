import models from '../models/index.model';
// import Char from '../utilities/charCaseHelpers';
import logger from '../logs/winston';

const { Buses } = models;

export default {
  create: async (req, res) => {
    const {
      number_plate, manufacturer, model, year, capacity,
    } = req.body;


    const bus = {
      number_plate,
      manufacturer,
      model,
      year,
      capacity,
    };

    await Buses.create(bus)
      .then((result) => {
        if (result === 'error500') {
          return res.status(500)
            .json({
              status: 'error',
              error: 'Internal server error ... please try again later',
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
