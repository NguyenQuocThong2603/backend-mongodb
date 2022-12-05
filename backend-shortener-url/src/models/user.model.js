import mongoose from 'mongoose';

const { Schema } = mongoose;

const UserSchema = new Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String },
  fullName: { type: String, required: true },
  isDisable: { type: Boolean, default: false },
});

const User = mongoose.model('User', UserSchema);

export default User;
