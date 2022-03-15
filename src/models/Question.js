import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  question_content: {
    type: String,
    required: [true, 'questionContent must be required.']
  },
  level: {
    type: String,
    enum: ['easy', 'medium', 'hard']
  },
  answer1: {
    type: String,
    required: [true, 'answer1 must be required.']
  },
  answer2: {
    type: String,
    required: [true, 'answer2 must be required.']
  },
  answer3: {
    type: String,
    required: [true, 'answer3 must be required.']
  },
  answer4: {
    type: String,
    required: [true, 'answer4 must be required.']
  },
  correct_answer: {
    type: String,
    enum: ['answer1', 'answer2', 'answer3', 'answer4']
  }
}, { timestamps: true });

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
