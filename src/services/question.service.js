import Question from './../models/Question';
import STATUS_CODE from './../constants/status_code';
import winston from './../helper/logger';

const getQuestions = async (infoPage) => {
  if (!infoPage.level) {
    winston.error('You need level for question in query.');
    return {
      statusCode: STATUS_CODE.BAD_REQUEST,
      message: 'You need level for question in query.'
    };
  }
  try {
    const pageOptions = {
      page: parseInt(infoPage.page, 10) || 1,
      limit: parseInt(infoPage.limit, 10) || 1
    };
    const levelQuestion = infoPage.level.toLowerCase();
    const skip_questions = (pageOptions.page - 1) * pageOptions.limit;
    let questions = await Question.find({ 'level': levelQuestion })
      .skip(skip_questions)
      .limit(pageOptions.limit)
      .lean()
      .select('question_content level answer1 answer2 answer3 answer4 correct_answer');

    for (let i = 0; i < questions.length; i++) {
      questions[i]['number'] = i + 1;
    }

    winston.debug(`Get #${pageOptions.limit} questions level ${levelQuestion} in page: #${pageOptions.page}`);
    return {
      statusCode: STATUS_CODE.SUCCESS,
      message: 'Get all question successfully',
      data: {
        page: pageOptions.page,
        limit: pageOptions.limit,
        count: questions.length,
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
