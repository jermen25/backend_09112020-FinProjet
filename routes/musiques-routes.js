const express = require('express');

const musiquesControllers = require('../controllers/musiques-controllers');

const router = express.Router();

router.get('/', musiquesControllers.getMusiques);

router.get('/:musiqueid', musiquesControllers.getMusiqueById );

//penser à ajouter le BodyParser dans app.js pour les POST
router.post('/', musiquesControllers.createMusique);

router.patch('/:musiqueid', musiquesControllers.updateMusique);

router.delete('/:musiqueid', musiquesControllers.deleteMusique);

module.exports = router;