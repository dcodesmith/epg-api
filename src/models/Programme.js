import mongoose from 'mongoose';
import createdModified from './plugins/createdModified';
import crud from './plugins/crud';
// import moment from 'moment-timezone';

const Schema = mongoose.Schema;
const ProgrammeSchema = new Schema({
  channel: {
    type: Schema.Types.ObjectId,
    ref: 'Channel',
    required: true
  },
  show: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  description: String,
  synopsis: String,
  day: {
    type: Number,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  season: Number,
  episode: Number,
  numberOfEpisodes: Number,
  genre: {
    type: String,
    required: true
  },
  frequency: String
}, { timestamps: true });

mongoose.Promise = Promise;

ProgrammeSchema.plugin(createdModified);
ProgrammeSchema.plugin(crud);

// TODO: Need to fix this
// ProgrammeSchema.virtual('startTimeISO').get(function startTimeISOVirtual() {
//   // return moment.tz(this.date + ' ' + this.startTime, 'Europe/London').format();
// });

// ProgrammeSchema.virtual('endTimeISO').get(function endTimeISOVirtual() {
//   // return moment.tz(this.date + ' ' + this.endTime, 'Europe/London').format();
// });

export default mongoose.model('Programme', ProgrammeSchema);
