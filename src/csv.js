import csv from 'fast-csv';
import Programme from './model/Programme';
import { find } from 'lodash';

const validRows = [];
const invalidRows = [];

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

export default function (csvData, channels, callbackFn) {
  const options = { trim: true, headers: true };

  const parser = (...args) => {
    const [ resolve, reject ] = args;

    const onValidateRow = (row, next) => {
      let isRowValid = true;
      const programme = new Programme(row);

      programme.validate(err => {
        if (err) {
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

    const onData = (validRow) => {
      validRows.push(validRow);
    };

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
      const channel = find(channels, { code: row.channelCode });

      delete row.channelCode;

      row.channel = channel.id;

      return row;
    };

    csv
      .fromStream(csvData, options)
      .transform(onTransform)
      .validate(onValidateRow)
      .on('data-invalid', onInvalidRow)
      .on('data', onData)
      .on('end', onEnd);
  }

  if (callbackFn) {
    return parser();
  }

  return new Promise(parser);
}
