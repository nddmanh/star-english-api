import AuthService from './../services/auth.service';
import STATUS_CODE from './../constants/status_code';
import winston from './../helper/logger';

const LOG_MODULE = '[AUTH-CONTROLLER]';

const register = async (req, res) => {
  try {
    const result = await AuthService.register(req.body);
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

const login = async (req, res) => {
  try {
    const result = await AuthService.login(req.body);
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

const getCurrentUser = async (req, res) => {
  try {
    const result = await AuthService.getCurrentUser(req.userId);
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

const verifyEmail = async (req, res) => {
  try {
    return await AuthService.verifyEmail(req, res);
  } catch (error) {
    winston.error(`${LOG_MODULE} ${error}`);
    res.status(STATUS_CODE.SERVER_ERROR_INTERNAL)
      .json({
        statusCode: STATUS_CODE.SERVER_ERROR_INTERNAL,
        message: 'Internal server error'
      });
  }
};

const loginGoogle = async (req, res) => {
  try {
    const result = await AuthService.loginGoogle(req.body);
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
  register,
  login,
  getCurrentUser,
  verifyEmail,
  loginGoogle
};
