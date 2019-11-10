const Card = require('../models/card');
const Error400 = require('../errors/400');
const Error403 = require('../errors/403');
const Error500 = require('../errors/500');

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => next(new Error400(`Произошла ошибка при создании карточки -- ${err}`)));
};

const getAllCards = (req, res, next) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.send({ data: cards }))
    .catch(() => next(new Error500('Произошла ошибка при поиске карточек')));
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.id)
  // eslint-disable-next-line consistent-return
    .then((card) => {
      if (!card) {
        return Promise.reject(new Error('Данные отсутствуют'));
      }
      if (JSON.stringify(card.owner) !== JSON.stringify(req.user._id)) {
        return Promise.reject(new Error('Вы не являетесь создателем данного изображения'));
      }
      Card.remove(card)
        .then((cardToDelete) => res.send(cardToDelete !== null ? { data: card } : { data: 'Нечего удалять' }))
        .catch(() => {
          throw new Error500('Ошибка при удалении карты');
        })
        .catch((err) => next(new Error403(err.message)));
    });
};

module.exports = {
  createCard, getAllCards, deleteCard,
};
