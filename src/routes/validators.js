import Joi from 'joi';

const channelValidator = {
  create: {
    body: {
      code: Joi.string().required(),
      name: Joi.string().required()
    }
  },
  update: {
    body: {
      username: Joi.string().required(),
      mobileNumber: Joi.string().regex(/^[1-9][0-9]{9}$/).required()
    },
    params: {
      id: Joi.string().hex().required()
    }
  }
};

const programmeValidator = {
  create: {
    body: {}
  },
  update: {
    body: {}
  }
};

export { channelValidator, programmeValidator };
