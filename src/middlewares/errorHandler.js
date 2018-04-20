import {
  BAD_REQUEST,
  UNPROCESSABLE_ENTITY,
  INTERNAL_SERVER_ERROR
} from 'http-status-codes';

const errorStatusCodeMap = {
  NoCSVFileException: BAD_REQUEST,
  InvalidCSVFileException: UNPROCESSABLE_ENTITY
};

export default (error, request, response, next) => { // eslint-disable-line no-unused-vars
  const {
    name: errorType,
    message: errorMessage
  } = error;

  const errorStatusCode = errorStatusCodeMap[errorType] || INTERNAL_SERVER_ERROR;

  response
    .status(errorStatusCode)
    .json({ message: errorMessage });
};
