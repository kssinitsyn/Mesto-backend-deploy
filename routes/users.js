const users = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { createUser, getAllUsers, getSingleUser } = require('../controllers/users');

users.get('/', getAllUsers);
users.get('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().alphanum(),
  }),
}), getSingleUser);
users.post('/', createUser);

module.exports = users;
