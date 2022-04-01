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
    await sendMail(userRec.email, transMail.subject(userRec.email), transMail.template(username, userRec.emailToken))
      .then((success) => {
        winston.debug(`Send verify email to: ${email}`);
      }).catch( async (err) => {
        await User.deleteOne(userRec);
        winston.error(err);
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
    if (!user.isVerified) {
      winston.error('User need verify email!');
      return {
        statusCode: STATUS_CODE.SUCCESS,
        message: 'User need verify email!',
        data: {
          accessToken: ''
        }
      };
    }
    winston.debug(`Login successfully with username: ${user.email}`);
    const accessToken = generateJwtToken(user);
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
      .select('id email fullname age school score role');
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
    winston.error(error);
    return {
      statusCode: STATUS_CODE.SERVER_ERROR_INTERNAL,
      message: 'Internal server error'
    };
  }
};

const loginGoogle = async (token) => {
  const { googleToken } = token;
  if (!googleToken ) {
    winston.error('Missing googleToken.');
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
    const foundExistingUser = await User.findOne({ email });
    if (!foundExistingUser) {
      const newUser = new User({
        email,
        password: null,
        fullname: name,
        age: null,
        school: null,
        emailToken: null,
        isVerified: true
      });
      const userRec = await newUser.save();
      winston.debug(`[SIGN IN WITH GOOGLE] Create a new user successfully with email: ${userRec.email}`);
      accessToken = generateJwtToken(userRec);
    } else {
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
  getCurrentUser,
  verifyEmail,
  loginGoogle
};
