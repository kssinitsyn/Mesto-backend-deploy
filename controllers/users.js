const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Error404 = require('../errors/404');
const Error400 = require('../errors/400');
const Error401 = require('../errors/401');
const Error500 = require('../errors/500');


// eslint-disable-next-line consistent-return
const createUser = (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return res.status(400).send({ message: 'Запрос пустой' });
  }

  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.status(201).send({
      _id: user._id, name: user.name, about: user.about, email: user.email,
    }))
    .catch((error) => next(new Error400(`Ошибка при создании пользователя - Error: ${error}`)));
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : 'some-secret-key',
        { expiresIn: '7d' },
      );
      res.status(201).cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      }).send({ message: 'Доступ открыт' });
    })
    .catch((error) => next(new Error401(error.message)));
};

const getAllUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => next(new Error500('Произошла ошибка при поиске всех пользователей')));
};

const getSingleUser = (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      if (user == null) {
        res.status(404).send({ message: 'Нет пользователя с таким id' });
      } else {
        res.send({ data: user });
      }
    })
    .catch(() => next(new Error404('Нет пользователя с таким id')));
};

module.exports = {
  createUser, login, getAllUsers, getSingleUser,
};
