// importation Express
const express = require('express');
// importation connexion a MongoDB
const mongoose = require('./db/db');
// import routeur associé aux utilisateurs
const userRoute = require("./routes/userRoute");

// Création de l'application express
const app = express();

//gerer les problème de CORS(partage ressources entre origines multiples)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// Analyse du corp de la requete
app.use(express.json());

app.use('/', (req, res) => {
    res.json({message: 'Salut Client, ici le Serveur! '});
    // console.log('Requete passe !!!')
});

// exportation du app
module.exports = app;