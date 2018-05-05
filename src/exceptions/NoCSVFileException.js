export default class NoCSVFileException extends Error {
  constructor() {
    super();

    this.name = 'NoCSVFileException';
    this.message = 'No CSV file found';
  }
}
