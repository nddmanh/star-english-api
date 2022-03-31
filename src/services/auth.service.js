require('dotenv').config();
import User from './../models/User';
import STATUS_CODE from './../constants/status_code';
import winston from './../helper/logger';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendMail } from '../configs/mail';
import { transMail } from '../lang/vi';

const register = async (user) => {
  const { email, password, fullname, age, school } = user;
  if (!email || !password || !fullname || !age || !school) {
    winston.error('Missing at least one field when registering.');
    return {
      statusCode: STATUS_CODE.BAD_REQUEST,
      message: 'Missing at least one field when registering.'
    };
  }
  try {
    const user = await User.findOne({ email });
    if (user) {
      winston.error('Username already taken.');
      return {
        statusCode: STATUS_CODE.BAD_REQUEST,
        message: 'Username already taken.'
      };
    }
    const hashedPassword = await argon2.hash(password);
    const newUser = new User({
      email,
      password: hashedPassword,
      fullname,
      age,
      school,
      emailToken: crypto.randomBytes(64).toString('hex'),
      isVerified: false
    });
    const userRec = await newUser.save();
    winston.debug(`Create a new user successfully with email: ${userRec.email}`);

    const username = email.split('@')[0];
    sendMail(userRec.email, transMail.subject(userRec.email), transMail.template(username, userRec.emailToken))
      .then( async (success) => {
        // await User.deleteOne(userRec);
      }).catch( async (err) => {
        // await User.remove(userRec);
        winston.error(err);
      });

    return {
      statusCode: STATUS_CODE.SUCCESS,
      message: 'User created successfully'
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
  const { email, password } = user;
  if (!email || !password ) {
    winston.error('Missing at least one field when login.');
    return {
      statusCode: STATUS_CODE.BAD_REQUEST,
      message: 'Missing at least one field when login.'
    };
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      winston.error('Incorrect email or password');
      return {
        statusCode: STATUS_CODE.BAD_REQUEST,
        message: 'Incorrect email or password'
      };
    }
    const passwordValid = await argon2.verify(user.password, password);
    if (!passwordValid) {
      winston.error('Incorrect email or password');
      return {
        statusCode: STATUS_CODE.BAD_REQUEST,
        message: 'Incorrect email or password'
      };
    }
    winston.debug(`Login successfully with username: ${user.username}`);
    const accessToken = jwt.sign(
      {
        userId: user._id,
        fullname: user.fullname,
        email: user.email,
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
    const user = await User.findById(userId)
      .select('id username fullname age school score role');
    if (!user) {
      winston.error('User not found.');
      return {
        statusCode: STATUS_CODE.NOT_FOUND,
        message: 'User not found.'
      };
    }
    winston.debug(`Get current user successfully with id: #${userId}`);
    return {
      statusCode: STATUS_CODE.SUCCESS,
      message: 'Get current user successfully.',
      data: user
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
