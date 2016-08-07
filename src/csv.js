var fs = require('fs');
var _ = require('lodash');
var csv = require('fast-csv');
var Channel = require('./model/Channel');
var Programme = require('./model/Programme');
var rowCount = 0;
var validRows = [];
var invalidRows = [];

function parse(csvData) {
	var options = {
		trim: true,
		headers: true
	}

	return new Promise((resolve, reject) => {
		csv
			.fromStream(csvData, options)
			.transform(onTransform)
			.validate(onValidateRow)
			.on('data-invalid', onInvalidRow)
			.on('data', onData)
			.on('end', onEnd);

		function onValidateRow(row, next) {
			var isRowValid = true;
			var programme;

			programme = new Programme(row);

			programme.validate((err, prog) => {
				if (err) {
					isRowValid = !isRowValid;
				}
				next(null, isRowValid);
			});
		}

		function onInvalidRow(invalidRow, rowNumber) {
			invalidRows.push({
				row: rowNumber,
				data: invalidRow
			});
		}

		function onData(validRow) {
			validRows.push(validRow);
		}

		function onEnd() {
			var errors = [];
			// errors = processErrors(validationErrors[iter]);
			errors = invalidRows.map((invalidItem) => {
					return {
						row: invalidItem.rowNumber,
						data: invalidItem.data
					}
			});

			if (errors.length) {
				return reject(errors);
			}
			resolve(validRows);
		}

		function onTransform(row, next) {
			var findChannel = Channel.findOne({code: row.channelCode}).exec();
			delete row.channelCode;

			// TODO: Perhaps pass in array of channels as a paremater from controller.
			findChannel.then(function(channel) {
				// TODO: ^^^
				// if (!channel) {
				// 	return next();
				// }
				row.channel = channel.id;
				next(null, row);
			}, next)
		}

	});
}

module.exports = {
	parse: parse
};
