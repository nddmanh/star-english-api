import PostService from './../services/post.service';
import STATUS_CODE from './../constants/status_code';
import winston from './../helper/logger';

const LOG_MODULE = '[POST-CONTROLLER]';

const getAllPosts = async (req, res) => {
  try {
    const result = await PostService.getAllPosts(req.query);
    return res.status(result.statusCode).json(result);
  } catch (error) {
    winston.error(`${LOG_MODULE} ${error}`);
    res.status(STATUS_CODE.SERVER_ERROR_INTERNAL)
      .json({
        statusCode: STATUS_CODE.SERVER_ERROR_INTERNAL,
        message: 'Internal server error'
      });
  }
};

const createOnePost = async (req, res) => {
  try {
    const result = await PostService.createOnePost(req.body);
    return res.status(result.statusCode).json(result);
  } catch (error) {
    winston.error(`${LOG_MODULE} ${error}`);
    res.status(STATUS_CODE.SERVER_ERROR_INTERNAL)
      .json({
        statusCode: STATUS_CODE.SERVER_ERROR_INTERNAL,
        message: 'Internal server error'
      });
  }
};

const findOnePost = async (req, res) => {
  try {
    const result = await PostService.findOnePost(req.params.id);
    return res.status(result.statusCode).json(result);
  } catch (error) {
    winston.error(`${LOG_MODULE} ${error}`);
    res.status(STATUS_CODE.SERVER_ERROR_INTERNAL)
      .json({
        statusCode: STATUS_CODE.SERVER_ERROR_INTERNAL,
        message: 'Internal server error'
      });
  }
};

module.exports = {
  getAllPosts,
  createOnePost,
  findOnePost
};
