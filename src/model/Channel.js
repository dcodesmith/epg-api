'use strict';

var mongoose = require('mongoose');
var createdModified = require('./plugins/createdModified');
var crud = require('./plugins/crud');

var Schema = mongoose.Schema;
var Channel = new Schema({
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
}, {timestamps: true});

// .virtual, .post, .static, .pre
mongoose.Promise = Promise;

Channel.plugin(createdModified);
Channel.plugin(crud);

Channel.virtual('logoPath').get(function() {
  return '/images/' + this.code + '.svg?' + this.createdAt.valueOf();
});

module.exports = mongoose.model('Channel', Channel);
