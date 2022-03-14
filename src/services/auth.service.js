import User from './../models/User';
import STATUS_CODE from './../constants/status_code';
import winston from './../helper/logger';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';

const register = async (user) => {
  const { username, password, fullname, age, school } = user;
  if (!username || !password || !fullname || !age || !school) {
    winston.error('Missing at least one field when registering.');
    return {
      statusCode: STATUS_CODE.BAD_REQUEST,
      message: 'Missing at least one field when registering.'
    };
  }
  try {
    const user = await User.findOne({ username });
    if (user) {
      winston.error('Username already taken.');
      return {
        statusCode: STATUS_CODE.BAD_REQUEST,
        message: 'Username already taken.'
      };
    }
    const hashedPassword = await argon2.hash(password);
    const newUser = new User({
      username,
      password: hashedPassword,
      fullname,
      age,
      school
    });
    const userRec = await newUser.save();
    winston.debug(`Create a new user successfully with username: ${userRec.username}`);
    const accessToken = jwt.sign(
      {
        userId: userRec._id,
        fullname: userRec.fullname,
        username: userRec.username,
        role: userRec.role
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_TTL || '3d' }
    );
    return {
      statusCode: STATUS_CODE.SUCCESS,
      message: 'User created successfully',
      data: {
        accessToken
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

const login = async (user) => {
  const { username, password } = user;
  if (!username || !password ) {
    winston.error('Missing at least one field when login.');
    return {
      statusCode: STATUS_CODE.BAD_REQUEST,
      message: 'Missing at least one field when login.'
    };
  }
  try {
    const user = await User.findOne({ username });
    if (!user) {
      winston.error('Incorrect username or password');
      return {
        statusCode: STATUS_CODE.BAD_REQUEST,
        message: 'Incorrect username or password'
      };
    }
    const passwordValid = await argon2.verify(user.password, password);
    if (!passwordValid) {
      winston.error('Incorrect username or password');
      return {
        statusCode: STATUS_CODE.BAD_REQUEST,
        message: 'Incorrect username or password'
      };
    }
    winston.debug(`Login successfully with username: ${user.username}`);
    const accessToken = jwt.sign(
      {
        userId: user._id,
        fullname: user.fullname,
        username: user.username,
        role: user.role
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_TTL || '3d' }
    );
    return {
      statusCode: STATUS_CODE.SUCCESS,
      message: 'User login successfully',
      data: {
        accessToken
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

const getCurrentUser = async (userId) => {
  try {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      winston.error('User not found.');
      return {
        statusCode: STATUS_CODE.NOT_FOUND,
        message: 'User not found.'
      };
    }
    winston.debug(`Get user successfully with id: #${userId}`);
    return {
      statusCode: STATUS_CODE.SUCCESS,
      message: 'Get user successfully.',
      data: {
        user
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

module.exports = {
  register,
  login,
  getCurrentUser
};
