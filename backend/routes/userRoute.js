// importation express permettant d'utiliser express.Router()
const express = require('express');
// Utilisation fonction Routeur()
const router = express.Router();
// import controller associé
const userCtrl = require("../controllers/userController");

// Route permettant l'inscription avec un mot de passe fort
router.post('/signup', userCtrl.signup);

// Route permettant la connexion
router.post('/login',  userCtrl.login);

// exportation du router
module.exports = router;
