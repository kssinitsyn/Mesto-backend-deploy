const users = require('express').Router();
const { createUser, getAllUsers, getSingleUser } = require('../controllers/users');

users.get('/', getAllUsers);
users.get('/:id', getSingleUser);
users.post('/', createUser);

module.exports = users;
