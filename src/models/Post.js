import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title must be required.']
  },
  description: {
    type: String
  },
  content: {
    type: String,
    required: [true, 'Content must be required.']
  }
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
