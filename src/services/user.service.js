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
    winston.error(`${LOG_MODULE} ${error}`);
    return {
      statusCode: STATUS_CODE.SERVER_ERROR_INTERNAL,
      message: 'Internal server error'
    };
  }
};

const leaderboard = async (infoPage) => {
  try {
    const pageOptions = {
      page: parseInt(infoPage.page, 10) || 1,
      limit: parseInt(infoPage.limit, 10) || 10
    };
    const skip_users = (pageOptions.page - 1) * pageOptions.limit;

    let countUsers = await User.countDocuments();
    let totalPages = Math.ceil(countUsers / pageOptions.limit);

    // Practice use aggregate
    let users = await User.aggregate([
      {
        $sort: {
          score: -1
        }
      },
      {
        $project:
        { 'score':true,
          'fullname': true
        }
      },
      { $skip: skip_users },
      { $limit: pageOptions.limit }
    ]);

    winston.debug(`${LOG_MODULE} Get #${pageOptions.limit} users in page: #${pageOptions.page}`);
    return {
      statusCode: STATUS_CODE.SUCCESS,
      message: 'Get all post successfully',
      data: {
        page: pageOptions.page,
        limit: pageOptions.limit,
        totalPages,
        users
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

module.exports = {
  updateScore,
  leaderboard
};
