
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');

const Musique = require('../models/musique');

const getMusiqueById = async (req, res, next) => {
  const musiqueId = req.params.musiqueid;

  let musique
  try {
    musique = await Musique.findById(musiqueId);
  } catch (err) {
    const error = new HttpError(
      'Erreur lors de la récupération de la musique',
      500
    );
    return next(error)
  }
  if (!musique) {
    const error = new HttpError(
      'Aucune musique trouvée pour cet id.',
      404
    );
    return next(error);
  }

  res.json({ musique: musique.toObject({ getters: true }) });
};

const getMusiques = async (req, res, next) => {
  let musiques
  try {
    musiques = await Musique.find();
  } catch (err) {
    const error = new HttpError(
      'Erreur lors de la récupération de la liste',
      500
    );
    return next(error)
  }
  res.json({ musiques: musiques.map(m => m.toObject({getters: true})) });
};

const createMusique = async (req, res, next) => {
  const { auteur, annee, titre, imageUrl } = req.body;
  
  const createdMusique = new Musique ({
    // id: uuid(),
    auteur,
    annee,
    titre,
    imageUrl
  })

  // MUSIQUES.push(createdMusique);
  try {
    await createdMusique.save();
    } catch (err) {
    const error = new HttpError(
      'L\'ajout de la Musique n\'a pas fonctionné. Veuillez réessayer.',
      500
    );
    return next(error);
  }
  

  // status 201 est utilisé pour confirmé que tout s'est passé correctement lors d'un ajout de données
  //status 200 est utilisé pour confirmé que tout s'est passé correctement (sans ajout de data)
  res.status(201).json({musique: createdMusique});
};

const updateMusique = async (req, res, next) => {
  const { auteur, annee, titre, imageUrl } = req.body;
  const musiqueId = req.params.musiqueid;
  let musique;
  try {
    musique = await Musique.findById(musiqueId);
  } catch (err) {
    const error = new HttpError(
      'Aucune musique trouvée pour cet id.',
      500
    );
    return next(error);
  }

  musique.auteur = auteur;
  musique.annee = annee;
  musique.titre = titre;
  musique.imageUrl = imageUrl;

  try {
    await musique.save();
  } catch (err) {
    const error = new HttpError(
      'Erreur lors de la mise à jour de cette musique.',
      500
    );
    return next(error);
  }

  res.status(200).json({musique: musique.toObject({ getters: true })});
};

const deleteMusique = async (req, res, next) => {
  const musiqueId = req.params.musiqueid;
  //retourne une nouvelle array filtré
  // MUSIQUES = MUSIQUES.filter(m => m.id !== musiqueId);
  let musique;
  try {
    musique = await Musique.findById(musiqueId)
  } catch (err){
    const error = new HttpError(
      'Erreur lors de la suppression de cette musique',
      500
    );
    return next(error);
  }
  if (!musique){
    const error = new HttpError(
      'Aucune musique trouvée pour cet id',
      404
    );
    return next(error);
  }
  try{
    await musique.remove();
  } catch (err) {
    const error = new HttpError(
      'Erreur lors de la suppression de cette musique.',
      500
    );
    return next(error);
  }
  res.status(200).json({ message: "Musique supprimée!" });
};

exports.getMusiqueById = getMusiqueById;
exports.getMusiques = getMusiques;
exports.createMusique = createMusique;
exports.updateMusique = updateMusique;
exports.deleteMusique = deleteMusique;