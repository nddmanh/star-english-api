require('dotenv').config();
import jwt from 'jsonwebtoken';

export const generateJwtToken = (user) => {
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
  return accessToken;
};
