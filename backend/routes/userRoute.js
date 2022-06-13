// importation express permettant d'utiliser express.Router()
const express = require('express');
// Utilisation fonction Routeur()
const router = express.Router();
// import controller associé
const userAuthCtrl = require("../controllers/userAuthController");
const userCtrl = require('../controllers/userController');

// Route permettant l'inscription avec un mot de passe fort
router.post('/signup', userAuthCtrl.signup);

// Route permettant d'afficher tous le users
router.get('/', userCtrl.getAllUsers);

// Route permettant d'afficher un seul users
router.get('/:id', userCtrl.getOneUser);

// rout permettant la mise a jour du user
router.put('/:id', userCtrl.updateUser);

// Route permettant la connexion
// router.post('/login',  userCtrl.login);

// exportation du router
module.exports = router;
