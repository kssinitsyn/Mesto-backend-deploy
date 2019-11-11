const cards = require('express').Router();
const { createCard, getAllCards, deleteCard } = require('../controllers/cards');

cards.get('/', getAllCards);
cards.post('/', createCard);
cards.delete('/:id', deleteCard);

module.exports = cards;
