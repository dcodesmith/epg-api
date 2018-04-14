import csv from 'fast-csv';
import find from 'lodash/find';

import Programme from './models/Programme';

/*
|---------------------------------------------------------------
| Usage
|---------------------------------------------------------------
| As a Promise -> parseCSV(bufferStream, channels)
|                   .then((programmes) => {
|                     callback(null, programmes);
|                   }).catch(callback);
|
| As a callback -> parseCSV(bufferStream, channels, callbackFn);
|
*/

export default (csvData, channels, callbackFn) => {
  const options = { trim: true, headers: true };
  const validRows = [];
  const invalidRows = [];

  const parser = (...args) => {
    const [resolve, reject] = args;

    const onValidateRow = (row, next) => {
      let isRowValid = true;
      const programme = new Programme(row);

      programme.validate((error) => {
        if (error) {
          isRowValid = !isRowValid;
        }

        next(null, isRowValid);
      });
    };

    const onInvalidRow = (invalidRow, rowNumber) => {
      invalidRows.push({
        row: rowNumber,
        data: invalidRow
      });
    };

    const onData = validRow => validRows.push(validRow);

    const onEnd = () => {
      const errors = invalidRows.map(row => ({ row: row.rowNumber, data: row.data }));

      if (errors.length) {
        if (callbackFn) {
          return callbackFn(errors, null);
        }

        return reject(errors);
      }

      if (callbackFn) {
        return callbackFn(null, validRows);
      }

      return resolve(validRows);
    };

    const onTransform = (row) => {
      const { id: channelId } = find(channels, { code: row.channelCode });
      const { channelCode, ...rest } = row;

      rest.channel = channelId;

      return rest;
    };

    csv
      .fromStream(csvData, options)
      .transform(onTransform)
      .validate(onValidateRow)
      .on('data-invalid', onInvalidRow)
      .on('data', onData)
      .on('end', onEnd);
  };

  if (callbackFn) {
    return parser();
  }

  return new Promise(parser);
};
