import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    birthDate: {
      type: Object,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    gender: {
      type: Number,
      required: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    avatarUrl: Object,
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('User', UserSchema);
