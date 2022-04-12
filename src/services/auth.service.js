require('dotenv').config();
import User from './../models/User';
import STATUS_CODE from './../constants/status_code';
import winston from './../helper/logger';
import { generateJwtToken } from './../helper/auth';
import argon2 from 'argon2';
import crypto from 'crypto';
import { sendMail } from '../configs/mail';
import { transMail } from '../lang/vi';
import { OAuth2Client } from 'google-auth-library';
import { TYPE_LOGIN_LOCAL, TYPE_LOGIN_GOOGLE } from '../constants/auth';

const LOG_MODULE = '[AUTH-SERVICE]';

const register = async (user) => {
  const { email, password, fullname } = user;
  if (!email || !password || !fullname ) {
    winston.error(`${LOG_MODULE} Missing at least one field when registering.`);
    return {
      statusCode: STATUS_CODE.BAD_REQUEST,
      message: 'Missing at least one field when registering.'
    };
  }
  try {
    const user = await User.findOne({
      email,
      typeLogin: TYPE_LOGIN_LOCAL
    });
    if (user) {
      winston.error(`${LOG_MODULE} Username already taken.`);
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
      typeLogin: TYPE_LOGIN_LOCAL,
      emailToken: crypto.randomBytes(64).toString('hex'),
      isVerified: false
    });
    const userRec = await newUser.save();
    winston.debug(`${LOG_MODULE} Create a new user successfully with email: ${userRec.email}`);

    const username = email.split('@')[0];
    await sendMail(userRec.email, transMail.subject(userRec.email), transMail.template(username, userRec.emailToken))
      .then((success) => {
        winston.debug(`${LOG_MODULE} Send verify email to: ${email}`);
      }).catch( async (err) => {
        await User.deleteOne(userRec);
        winston.error(`${LOG_MODULE} ${err}`);
        return {
          statusCode: STATUS_CODE.BAD_REQUEST,
          message: 'User created failed'
        };
      });

    return {
      statusCode: STATUS_CODE.SUCCESS,
      message: 'User created successfully'
    };
  } catch (error) {
    winston.error(`${LOG_MODULE} ${error}`);
    return {
      statusCode: STATUS_CODE.SERVER_ERROR_INTERNAL,
      message: 'Internal server error'
    };
  }
};

const login = async (user) => {
  const { email, password } = user;
  if (!email || !password ) {
    winston.error(`${LOG_MODULE} Missing at least one field when login.`);
    return {
      statusCode: STATUS_CODE.BAD_REQUEST,
      message: 'Missing at least one field when login.'
    };
  }
  try {
    const user = await User.findOne({
      email,
      typeLogin: TYPE_LOGIN_LOCAL
    });
    if (!user) {
      winston.error(`${LOG_MODULE} Incorrect email`);
      return {
        statusCode: STATUS_CODE.BAD_REQUEST,
        message: 'Incorrect email or password'
      };
    }
    const passwordValid = await argon2.verify(user.password, password);
    if (!passwordValid) {
      winston.error(`${LOG_MODULE} Incorrect password`);
      return {
        statusCode: STATUS_CODE.BAD_REQUEST,
        message: 'Incorrect email or password'
      };
    }
    if (!user.isVerified) {
      winston.error(`${LOG_MODULE} User need verify email!`);
      return {
        statusCode: STATUS_CODE.SUCCESS,
        message: 'User need verify email!',
        data: {
          accessToken: ''
        }
      };
    }
    winston.debug(`${LOG_MODULE} Login successfully with username: ${user.email}`);
    const accessToken = generateJwtToken(user);
    return {
      statusCode: STATUS_CODE.SUCCESS,
      message: 'User login successfully',
      data: {
        accessToken
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

const getCurrentUser = async (userId) => {
  try {
    const user = await User.findById(userId)
      .select('email fullname score role');
    if (!user) {
      winston.error(`${LOG_MODULE} User not found.`);
      return {
        statusCode: STATUS_CODE.NOT_FOUND,
        message: 'User not found.'
      };
    }
    winston.debug(`${LOG_MODULE} Get current user successfully with id: #${userId}`);
    return {
      statusCode: STATUS_CODE.SUCCESS,
      message: 'Get current user successfully.',
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

const verifyEmail = async (req, res) => {
  try {
    let emailToken = req.query.token;
    const userRec = await User.findOne({ emailToken });
    if (userRec) {
      userRec.emailToken = null;
      userRec.isVerified = true;
      await userRec.save();
      res.render('verify_success');
    } else {
      res.render('404');
    }
  } catch (error) {
    winston.error(`${LOG_MODULE} ${error}`);
    return {
      statusCode: STATUS_CODE.SERVER_ERROR_INTERNAL,
      message: 'Internal server error'
    };
  }
};

const loginGoogle = async (token) => {
  const { googleToken } = token;
  if (!googleToken ) {
    winston.error(`${LOG_MODULE} Missing googleToken.`);
    return {
      statusCode: STATUS_CODE.BAD_REQUEST,
      message: 'Missing googleToken.'
    };
  }
  let ggClientId = process.env.GG_CLIENT_ID;
  let ggSecret = process.env.GG_CLIENT_SECRET;
  try {
    const oAuth2Client = new OAuth2Client(ggClientId, ggSecret);
    let ggLoginTicket = await oAuth2Client.verifyIdToken({
      idToken: googleToken,
      audience: ggClientId
    });
    const {
      email_verified,
      email,
      name
    } = ggLoginTicket.getPayload();
    if (!email_verified) {
      return {
        statusCode: STATUS_CODE.FORBIDDEN,
        message: `Email ${email} is not verified`
      };
    }
    let accessToken;
    // Create random password, don't use
    let randomStr = (Math.random() + 1).toString(36).substring(6);
    const foundExistingUser = await User.findOne({
      email,
      typeLogin: TYPE_LOGIN_GOOGLE
    });
    if (!foundExistingUser) {
      const newUser = new User({
        email,
        password: randomStr,
        fullname: name,
        typeLogin: TYPE_LOGIN_GOOGLE,
        emailToken: null,
        isVerified: true
      });
      const userRec = await newUser.save();
      winston.debug(`${LOG_MODULE} Create a new user successfully with email: ${userRec.email}`);
      accessToken = generateJwtToken(userRec);
    } else {
      winston.debug(`${LOG_MODULE} Signin google with email: ${email}`);
      accessToken = generateJwtToken(foundExistingUser);
    }
    return {
      statusCode: STATUS_CODE.SUCCESS,
      message: 'User login google successfully',
      data: {
        accessToken
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
  register,
  login,
  getCurrentUser,
  verifyEmail,
  loginGoogle
};
