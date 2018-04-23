import expressWinston from 'express-winston';

import { transports } from '../util/logger';

export default expressWinston.logger({ transports });
