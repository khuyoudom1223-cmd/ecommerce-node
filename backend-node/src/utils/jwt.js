import jwt from 'jsonwebtoken';

export const signToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET || 'local_dev_jwt_secret_change_in_production', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET || 'local_dev_jwt_secret_change_in_production');
};
