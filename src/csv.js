const csv = require('fast-csv');
const Channel = require('./model/Channel');
const Programme = require('./model/Programme');

const validRows = [];
const invalidRows = [];

function parse(csvData) {
  const options = {
    trim: true,
    headers: true
  };

  return new Promise((resolve, reject) => {
    const onValidateRow = (row, next) => {
      let isRowValid = true;
      const programme = new Programme(row);

      programme.validate((err) => {
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
      let errors = [];
      // errors = processErrors(validationErrors[iter]);
      errors = invalidRows.map((invalidItem) => {
          return {
            row: invalidItem.rowNumber,
            data: invalidItem.data
          };
      });

      if (errors.length) {
        return reject(errors);
      }
      resolve(validRows);
    };

    const onTransform = (row, next) => {
      const findChannel = Channel.findOne({ code: row.channelCode }).exec();
      delete row.channelCode;

      // TODO: Perhaps pass in array of channels as a paremater from controller.
      findChannel.then((channel) => {
        // TODO: ^^^
        // if (!channel) {
        //   return next();
        // }
        row.channel = channel.id;
        next(null, row);
      }, next);
    };

    csv
      .fromStream(csvData, options)
      .transform(onTransform)
      .validate(onValidateRow)
      .on('data-invalid', onInvalidRow)
      .on('data', onData)
      .on('end', onEnd);
  });
}

module.exports = { parse };
