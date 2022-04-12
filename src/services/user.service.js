import User from './../models/User';
import AuthService from './auth.service';
import STATUS_CODE from './../constants/status_code';
import winston from './../helper/logger';

const LOG_MODULE = '[USER-SERVICE]';

const updateScore = async (userId, user) => {
  try {
    const { score } = user;
    if (!score) {
      winston.error(`${LOG_MODULE} Score field is requied`);
      return {
        statusCode: STATUS_CODE.BAD_REQUEST,
        message: 'Score field is requied'
      };
    }
    const currentUser = await AuthService.getCurrentUser(userId);
    if (currentUser?.data?.score < score) {
      await User.findOneAndUpdate(
        { _id: userId },
        user,
        { new: true }
      );
      winston.debug(`${LOG_MODULE} Update user successfully with id: #${userId}`);
      return {
        statusCode: STATUS_CODE.SUCCESS,
        message: 'Update user successfully.',
        data: user
      };
    }
    return {
      statusCode: STATUS_CODE.SUCCESS,
      message: 'Update user successfully.',
      data: user
    };
  } catch (error) {
    winston.error(`${LOG_MODULE} User need level for question in query.`);
    return {
      statusCode: STATUS_CODE.SERVER_ERROR_INTERNAL,
      message: 'Internal server error'
    };
  }
};

module.exports = {
  updateScore
};
