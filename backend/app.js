// importation Express
const express = require('express');
// importation connexion a MongoDB
const mongoose = require('./db/db');
const bodyParser = require('body-parser');
// recup module 'cookie-parser' (lire les cookies)
const cookiePrser = require('cookie-parser');
// import route associé aux utilisateurs
const userRoute = require("./routes/userRoute");
// import route associé au postage
const postRoutes = require('./routes/postRoutes');
//recuperation function 'checkUser'
const {checkUser, requireAuth} = require('./middleware/auth.middleware');
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
app.use(bodyParser.json());
// Pour lire les URL
app.use(bodyParser.urlencoded({extended: true}));
//utilisation du 'cookiParser'
app.use(cookiePrser());

// utilisation 'checkUser': pout toute route vérification si l'user 
// a le token valid
app.get('*', checkUser);
app.get('/jwtid', requireAuth, (req, res) => {
    res.status(200).send(res.locals.user._id)
});

// route utilisateur
app.use('/api/user', userRoute);
// utilisation postRoute.js
app.use('/api/post', postRoutes);

app.use('/', (req, res) => {
    res.json({message: 'Salut Client, ici le Serveur! '});
    // console.log('Requete passe !!!')
});

// exportation du app
module.exports = app;