import {
  BAD_REQUEST,
  UNPROCESSABLE_ENTITY,
  INTERNAL_SERVER_ERROR
} from 'http-status-codes';

const errorStatusCodeMap = {
  NoCSVFileException: BAD_REQUEST,
  InvalidCSVFileException: UNPROCESSABLE_ENTITY
};

export default (err, request, response, next) => { // eslint-disable-line no-unused-vars
  const {
    name: errorType,
    message: errorMessage,
    error = {}
  } = err;

  const errorStatusCode = errorStatusCodeMap[errorType] || INTERNAL_SERVER_ERROR;

  response
    .status(errorStatusCode)
    .json({ message: errorMessage, error });
};
