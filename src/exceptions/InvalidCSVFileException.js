export default class InvalidCSVFileException extends Error {
  constructor(error) {
    super();

    this.name = 'InvalidCSVFileException';
    this.message = 'Invalid CSV File';

    if (error) {
      this.error = error;
    }
  }
}
