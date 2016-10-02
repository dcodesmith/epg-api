import mongoose from 'mongoose';
import createdModified from './plugins/createdModified';
import crud from './plugins/crud';

const ChannelSchema = new mongoose.Schema({
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

ChannelSchema.plugin(createdModified);
ChannelSchema.plugin(crud);

// Channel.virtual('logoPath').get(() =>
// { return `/images/${this.code}.svg?${this.createdAt.valueOf()}` });

export default mongoose.model('Channel', ChannelSchema);
