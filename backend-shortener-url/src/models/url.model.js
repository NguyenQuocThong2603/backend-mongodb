import mongoose from 'mongoose';

const { Schema } = mongoose;

const UrlSchema = new Schema({
  urlID: { type: String, unique: true },
  originalUrl: { type: String, required: true },
  count: { type: Number, default: 0 },
  user: Object,
});

const Url = mongoose.model('Url', UrlSchema);

export default Url;
