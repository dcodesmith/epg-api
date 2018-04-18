import Joi from 'joi';

Joi.objectId = require('joi-objectid')(Joi);

const schema = {
  channel: Joi.objectId().required(),
  show: Joi.string().required(),
  type: Joi.string().required(),
  description: Joi.string(),
  synopsis: Joi.string(),
  day: Joi.number(),
  startTime: Joi.string().required(),
  endTime: Joi.string().required(),
  season: Joi.number(),
  episode: Joi.number(),
  numberOfEpisodes: Joi.number(),
  genre: Joi.string().required(),
  frequency: Joi.string()
};

export default schema;
