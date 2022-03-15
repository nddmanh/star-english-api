import QuestionService from './../services/question.service';
import STATUS_CODE from './../constants/status_code';
import winston from './../helper/logger';

const getQuestions = async (req, res) => {
  try {
    const result = await QuestionService.getQuestions(req.query);
    return res.status(result.statusCode).json(result);
  } catch (error) {
    winston.error(error);
    res.status(STATUS_CODE.SERVER_ERROR_INTERNAL)
      .json({
        statusCode: STATUS_CODE.SERVER_ERROR_INTERNAL,
        message: 'Internal server error'
      });
  }
};

const createOneQuestion = async (req, res) => {
  try {
    const result = await QuestionService.createOneQuestion(req.body);
    return res.status(result.statusCode).json(result);
  } catch (error) {
    winston.error(error);
    res.status(STATUS_CODE.SERVER_ERROR_INTERNAL)
      .json({
        statusCode: STATUS_CODE.SERVER_ERROR_INTERNAL,
        message: 'Internal server error'
      });
  }
};

module.exports = {
  getQuestions,
  createOneQuestion
};
