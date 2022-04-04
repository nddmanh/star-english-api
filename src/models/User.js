import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: [true, 'email must be required.']
  },
  password: {
    type: String,
    required: [true, 'Password must be required.'],
    minlength: [6, 'Password must be at least 6 charecters']
  },
  fullname: {
    type: String,
    required: [true, 'fullname must be required.']
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  typeLogin: {
    type: String,
    enum: ['local', 'google'],
    required: [true]
  },
  score: {
    type: Number,
    default: 0
  },
  emailToken: {
    type: String
  },
  isVerified: {
    type: Boolean
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
