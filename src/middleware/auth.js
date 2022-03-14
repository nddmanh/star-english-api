const jwt = require('jsonwebtoken');
import STATUS_CODE from './../constants/status_code';
import winston from './../helper/logger';

const verifyToken = (req, res, next) => {
  const authHeader = req.header('Authorization') || req.header('authorization');
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    winston.error('Access token not found');
    return res
      .status(STATUS_CODE.UNAUTHORIZED)
      .json({
        statusCode: STATUS_CODE.UNAUTHORIZED,
        message: 'Access token not found'
      });
  }
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    winston.error(error);
    return res.status(403).json({
      statusCode: STATUS_CODE.FORBIDDEN,
      message: 'Invalid token'
    });
  }
};

module.exports = verifyToken;
