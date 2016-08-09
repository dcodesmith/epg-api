'use strict';

var mongoose = require('mongoose');
var createdModified = require('./plugins/createdModified');
var crud = require('./plugins/crud');
var moment = require('moment-timezone');
var Schema = mongoose.Schema;
var Programme = new Schema({
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
  date: {
    type: Date,
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
}, {timestamps: true});

mongoose.Promise = Promise;

Programme.plugin(createdModified);
Programme.plugin(crud);

// TODO: Need to fix this
Programme.virtual('startTimeISO').get(function startTimeISOVirtual() {
  // return moment.tz(this.date + ' ' + this.startTime, 'Europe/London').format();
});

Programme.virtual('endTimeISO').get(function endTimeISOVirtual() {
  // return moment.tz(this.date + ' ' + this.endTime, 'Europe/London').format();
});

module.exports = mongoose.model('Programme', Programme);
