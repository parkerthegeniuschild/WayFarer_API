import models from '../models/index.model';
import Char from '../utilities/charCaseHelpers';
import logger from '../logs/winston';

const { Buses } = models;

export default {
  /** Create a buses
   * @param req
   * @param res
   * @returns {object}
   */
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

  /** Get all buses
   * @param req
   * @param res
   * @returns {object}
   */
  findAll: async (req, res) => {
    const filters = {
      manufacturer: Char.upperCaseFirst(req.query.manufacturer),
      model: Char.upperCaseFirst(req.query.model),
      year: req.query.year,
    };

    await Buses.getAll(filters)
      .then((result) => {
        if (!result) {
          return res.status(400).json({
            status: 'error',
            error: 'Bad request: Your query is malformed',
          });
        } if (result.length < 1) {
          return res.status(200)
            .json({
              status: 'success',
              error: 'No buses found',
            });
        }
        return res.status(200).json({
          status: 'success',
          data: result,
        });
      })
      .catch(err => logger.error(err));
  },

};
