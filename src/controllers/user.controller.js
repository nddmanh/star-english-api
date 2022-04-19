import UserService from './../services/user.service';
import STATUS_CODE from './../constants/status_code';
import winston from './../helper/logger';

const LOG_MODULE = '[USER-CONTROLLER]';

const updateScore = async (req, res) => {
  try {
    const result = await UserService.updateScore(req.userId, req.body);
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

const leaderboard = async (req, res) => {
  try {
    const result = await UserService.leaderboard(req.query);
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
  updateScore,
  leaderboard
};
