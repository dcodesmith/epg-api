import stream from 'stream';
import { promisify } from 'util';
import { CREATED } from 'http-status';

import createController from './index';
import parseCSV from '../csv';
import Programme from '../models/Programme';
import Channel from '../models/Channel';
import { NoCSVFileException, InvalidCSVFileException } from '../exceptions';

const importCSV = async (request, response) => {
  const bufferStream = new stream.PassThrough();
  const { file } = request;
  let channels;
  let programmes;
  let parsedCSV;

  if (!file) {
    throw new NoCSVFileException();
  }

  bufferStream.end(file.buffer);

  try {
    channels = await Channel.find();
  } catch (error) {
    throw new NoCSVFileException(); // FIX!
  }

  try {
    parsedCSV = await promisify(parseCSV)(bufferStream, channels);
  } catch (error) {
    throw new InvalidCSVFileException(error);
  }

  try {
    await Programme.create(parsedCSV);
  } catch (error) {
    throw new NoCSVFileException(); // FIX!
  }

  try {
    programmes = await Programme.find().populate('channel');
  } catch (error) {
    throw new NoCSVFileException(); // FIX!
  }

  response.status(CREATED).json(programmes);
};

export default createController(Programme, { importCSV });
