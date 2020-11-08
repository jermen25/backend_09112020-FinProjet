
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');

const Film = require('../models/film');

  const getFilms = async (req, res, next) => {
    let films
    try {
      films = await Film.find();
    } catch (err) {
      const error = new HttpError(
        'Erreur lors de la récupération de la liste',
        500
      );
      return next(error)
    }
    res.json({ films: films.map(f => f.toObject({getters: true})) });
  }

  const getFilmsById = async (req, res, next) => {
    const filmId = req.params.filmid;
    let film
    try {
      film = await Film.findById(filmId);
    } catch (err) {
      const error = new HttpError(
        'Erreur lors de la récupération de la film',
        500
      );
      return next(error)
    }
    if (!film) {
      const error = new HttpError(
        'Aucun film trouvée pour cet id.',
        404
      );
      return next(error);
    }
  
    res.json({ film: film.toObject({ getters: true }) });
  }

  const createFilm = async (req, res, next) => {
    const { auteur, annee, titre, imageUrl } = req.body;
    const createdFilm = new Film ({
      // id: uuid(),
      auteur,
      annee,
      titre,
      imageUrl
    })
  
    // FILMS.push(createdFilm);
    try {
      await createdFilm.save();
      } catch (err) {
      const error = new HttpError(
        'L\'ajout du film n\'a pas fonctionné. Veuillez réessayer.',
        500
      );
      return next(error);
    }



    // status 201 est utilisé pour confirmé que tout s'est passé correctement lors d'un ajout de données
    //status 200 est utilisé pour confirmé que tout s'est passé correctement (sans ajout de data)
    res.status(201).json({film: createdFilm});
  };


  const updateFilm = async (req, res, next) => {
    const { id, auteur, annee, titre, imageUrl } = req.body;
    const filmId = req.params.filmid;
  
    let film;
    try {
      film = await Film.findById(filmId);
    } catch (err) {
      const error = new HttpError(
        'Aucun film trouvé pour cet id.',
        500
      );
      return next(error);
    }
  
    film.auteur = auteur;
    film.annee = annee;
    film.titre = titre;
    film.imageUrl = imageUrl;

    try {
      await film.save();
    } catch (err) {
      const error = new HttpError(
        'Erreur lors de la mise à jour de ce film.',
        500
      );
      return next(error);
    }
  
    res.status(200).json({film: film.toObject({ getters: true })});

  };
  
  const deleteFilm = async (req, res, next) => {
    const filmId = req.params.filmid;

    let film;
  try {
    film = await Film.findById(filmId)
  } catch (err){
    const error = new HttpError(
      'Erreur lors de la suppression de ce film',
      500
    );
    return next(error);
  }
  if (!film){
    const error = new HttpError(
      'Aucun film trouvé pour cet id',
      404
    );
    return next(error);
  }
  try{
    await film.remove();
  } catch (err) {
    const error = new HttpError(
      'Erreur lors de la suppression de ce film.',
      500
    );
    return next(error);
  }
  res.status(200).json({ message: "Film supprimée!" });
  };
  
exports.getFilmsById = getFilmsById;
exports.getFilms = getFilms;
exports.createFilm = createFilm;
exports.updateFilm = updateFilm;
exports.deleteFilm = deleteFilm;