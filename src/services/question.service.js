import Question from './../models/Question';
import STATUS_CODE from './../constants/status_code';
import winston from './../helper/logger';

const getQuestions = async (infoPage) => {
  try {
    const pageOptions = {
      page: parseInt(infoPage.page, 10) || 1,
      limit: parseInt(infoPage.limit, 10) || 1
    };
    const skip_questions = (pageOptions.page - 1) * pageOptions.limit;
    const questions = await Question.find()
      .skip(skip_questions)
      .limit(pageOptions.limit);

    winston.debug(`Get #${pageOptions.limit} questions in page: #${pageOptions.page}`);
    return {
      statusCode: STATUS_CODE.SUCCESS,
      message: 'Get all question successfully',
      data: {
        page: pageOptions.page,
        limit: pageOptions.limit,
        questions
      }
    };
  } catch (error) {
    winston.error(error);
    return {
      statusCode: STATUS_CODE.SERVER_ERROR_INTERNAL,
      message: 'Internal server error'
    };
  }
};

const createOneQuestion = async (question) => {
  const {
    question_content,
    level,
    answer1,
    answer2,
    answer3,
    answer4,
    correct_answer
  } = question;
  try {
    let newQuestion = new Question({
      question_content,
      level,
      answer1,
      answer2,
      answer3,
      answer4,
      correct_answer
    });
    await newQuestion.save();
    winston.debug(`Create a new question with id: #${newQuestion._id}`);
    return {
      statusCode: STATUS_CODE.SUCCESS,
      message: 'Create a question successfully!',
      data: newQuestion
    };
  } catch (error) {
    winston.error(error);
    return {
      statusCode: STATUS_CODE.SERVER_ERROR_INTERNAL,
      message: 'Internal server error'
    };
  }
};

module.exports = {
  getQuestions,
  createOneQuestion
};
