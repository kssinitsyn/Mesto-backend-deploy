const Card = require('../models/card');

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(400).send({ message: `Произошла ошибка при создании карточки -- ${err}` }));
};

const getAllCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка при поиске карточек' }));
};

const deleteCard = (req, res) => {
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
        .catch((err) => res.status(500).send({ message: err.message }));
    })
    .catch((err) => res.status(403).send({ message: err.message }));
};

module.exports = {
  createCard, getAllCards, deleteCard,
};
