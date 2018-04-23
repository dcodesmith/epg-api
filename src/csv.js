import csv from 'fast-csv';
import find from 'lodash/find';
import Joi from 'joi';

import schema from './validation-schema';

export default (csvData, channels, callbackFn) => {
  const options = { trim: true, headers: true };
  const validRows = [];
  const invalidRows = [];

  const parser = () => {
    const onValidateRow = (row, next) => {
      let isRowValid = true;

      Joi.validate(row, schema, (error) => {
        if (error) {
          isRowValid = !isRowValid;
        }

        next(null, isRowValid);
      });
    };

    const onInvalidRow = (invalidRow, rowNumber) => {
      invalidRows.push({
        row: rowNumber + 1,
        data: invalidRow
      });
    };

    const onData = validRow => validRows.push(validRow);

    const onEnd = () => {
      const errors = invalidRows.map(({ row, data }) => ({ row, data }));

      if (errors.length) {
        return callbackFn(errors, null);
      }

      return callbackFn(null, validRows);
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

  return parser();
};
