const mainRouter = require('express').Router();

const cardsRouter = require('./cards');
const usersRouter = require('./users');

mainRouter.use('/cards', cardsRouter);
mainRouter.use('/users', usersRouter);

module.exports = mainRouter;
