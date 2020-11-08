const express = require('express');

const filmsControllers = require('../controllers/films-controllers');

const router = express.Router();

router.get('/', filmsControllers.getFilms);

router.get('/:filmid', filmsControllers.getFilmsById);

//penser à ajouter le BodyParser dans app.js pour les POST
router.post('/', filmsControllers.createFilm);

router.patch('/:filmid', filmsControllers.updateFilm);

router.delete('/:filmid', filmsControllers.deleteFilm);

module.exports = router;