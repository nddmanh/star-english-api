import Question from './../models/Question';
import STATUS_CODE from './../constants/status_code';
import winston from './../helper/logger';

const LOG_MODULE = '[QUESTION-SERVICE]';

const getQuestions = async (infoPage) => {
  if (!infoPage.level) {
    winston.error(`${LOG_MODULE} User need level for question in query.`);
    return {
      statusCode: STATUS_CODE.BAD_REQUEST,
      message: 'You need level for question in query.'
    };
  }
  try {
    const pageOptions = {
      page: parseInt(infoPage.page, 10) || 1,
      limit: parseInt(infoPage.limit, 10) || 10
    };
    const levelQuestion = infoPage.level.toLowerCase();
    let question_size;
    let questions = [];
    let arr_randoms = [];
    let num_question = await Question.countDocuments({ 'level': levelQuestion });
    winston.debug(`${LOG_MODULE} Count the num question with level #${levelQuestion}: ${num_question}`);
    if (num_question > pageOptions.limit) {
      question_size = pageOptions.limit;
    } else {
      question_size = num_question;
    }
    while (arr_randoms.length < question_size) {
      let random = Math.floor(Math.random() * num_question);
      if (arr_randoms.indexOf(random) === -1) arr_randoms.push(random);
    }
    for (const random of arr_randoms) {
      let question = await Question.findOne().skip(random)
        .lean()
        .select('question_content level answer1 answer2 answer3 answer4 correct_answer');
      questions.push(question);
    }
    for (let i = 0; i < questions.length; i++) {
      questions[i]['number'] = i + 1;
    }
    winston.debug(`${LOG_MODULE} Get #${question_size} questions level ${levelQuestion} in page: #${pageOptions.page}`);
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
    winston.error(`${LOG_MODULE} ${error}`);
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
    winston.debug(`${LOG_MODULE} Create a new question with id: #${newQuestion._id}`);
    return {
      statusCode: STATUS_CODE.SUCCESS,
      message: 'Create a question successfully!',
      data: newQuestion
    };
  } catch (error) {
    winston.error(`${LOG_MODULE} ${error}`);
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
