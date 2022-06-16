// importation express permettant d'utiliser express.Router()
const express = require('express');
// Utilisation fonction Routeur()
const router = express.Router();
// import controller associé
const userAuthCtrl = require("../controllers/userAuthController");
const userCtrl = require('../controllers/userController');
const uploadCtrl = require('../controllers/uploadController');
const multer = require("multer");
const upload = multer();

// Route permettant l'inscription avec un mot de passe fort
router.post('/register', userAuthCtrl.signUp);
// Route permettant la connexion
router.post('/login', userAuthCtrl.signIn);
// Route permettant la deconexion
router.get('/logout', userAuthCtrl.logout);

// Route permettant d'afficher tous le users
router.get('/', userCtrl.getAllUsers);

// Route permettant d'afficher un seul users
router.get('/:id', userCtrl.getOneUser);

// rout permettant la mise a jour du user
router.put('/:id', userCtrl.updateUser);

// route permettant la suppression d'un user
router.delete('/:id', userCtrl.deleteUser);

//route permettant de mettre a jour l'interieur du tab
router.patch('/follow/:id', userCtrl.follow);
router.patch('/unfollow/:id', userCtrl.unfollow);

// Routes associés au téléchargement fichiers
router.post('/upload', upload.single('file'), uploadCtrl.uploadProfil)

// exportation du router
module.exports = router;
