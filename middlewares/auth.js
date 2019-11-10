const jwt = require('jsonwebtoken');
const Error401 = require('../errors/401');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : 'some-secret-key');
  } catch (error) {
    next(new Error401('Необходима авторизация'));
  }

  req.user = payload;

  next();
};
