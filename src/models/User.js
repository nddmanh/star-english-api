import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: [true, 'username must be required.']
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
  score: {
    type: Number,
    default: 0
  },
  age: {
    type: Number,
    required: [true, 'age must be required.']
  },
  school: {
    type: String,
    required: [true, 'fullname must be required.']
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
