const mongoose = require('mongoose');
const createdModified = require('./plugins/createdModified');
const crud = require('./plugins/crud');

const Schema = mongoose.Schema;
const Channel = new Schema({
  name: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true
  },
  type: String,
  description: String
}, { timestamps: true });

// .virtual, .post, .static, .pre
mongoose.Promise = Promise;

Channel.plugin(createdModified);
Channel.plugin(crud);

// Channel.virtual('logoPath').get(() =>
// { return `/images/${this.code}.svg?${this.createdAt.valueOf()}` });

module.exports = mongoose.model('Channel', Channel);
