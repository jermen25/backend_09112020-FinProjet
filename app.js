const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const filmsRoutes = require('./routes/films-routes');
const musiquesRoutes = require('./routes/musiques-routes');
const HttpError = require('./models/http-error');

const app = express();

//Ajouté pour méthode POST
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  
    next();
  });

app.use('/api/films', filmsRoutes);
app.use('/api/musiques', musiquesRoutes);


//Gestion du router si aucune route prélable n'est trouvée (en dernier)
//penser à ajouter le HttpError 
//dans ce cas l'erreur est passée au middleware suivant en charge de la gestion des erreurs
app.use((req, res, next) => {
    const error = new HttpError('Page non trouvée', 404);
    next(error); //throw(error)
});

//Middleware de Gestion d'erreur fourni par Express
//Lorsque 4 arguments sont passés, Express reconnait le 1er argument comme étant une erreur (overloading)
//ce code ne s'exécute qu'en cas d'erreur de routage
app.use((error, req, res, next) => {
    if (res.headerSent) { //vérifier si la réponse a terminé / a été retournée
        return next(error);
    }
    res.status(error.code || 500); //vérifier si un code erreur spécifique a été généré par le router
    res.json({ message: error.message || 'Une erreur non gérée est survenue' })
});

/******************************************************************************************* */
/******************************************************************************************* */
//Penser à remplacer la connectionString ci-dessous avec vos propres identifiants MongoDB
/******************************************************************************************* */
/******************************************************************************************* */

mongoose
.connect( `mongodb+srv://mongoUtilisateur:mongoMdp@monServeurPerso.mongodb.net/NomBaseDeDonnees?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(5000);
  })
  .catch(err => {
    console.log(err);
  });

