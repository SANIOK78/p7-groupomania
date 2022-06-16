// importation express permettant d'utiliser express.Router()
const express = require('express');
// Utilisation fonction Routeur()
const router = express.Router();
// import postContrôleur
const postCtrl = require('../controllers/postController');
const multer = require("multer");
const upload = multer();

// route permettant d'afficher tous les postages
router.get('/', postCtrl.readPost);
// route permettant creation d'un postage
router.post('/', upload.single('file'), postCtrl.createPost);
// route permettant la mise a jour d'un postage
router.put('/:id', postCtrl.updatePost);
// route permettant la suppression d'un post
router.delete('/:id', postCtrl.deletePost);

// route associé aux 'likes'
router.patch('/like-post/:id', postCtrl.likePost);
// route associé aux 'disLikes'
router.patch('/unlike-post/:id', postCtrl.unlikePost);

// Routes associées aux commentaires:
// 1. Laisser un commentaire(:id = id de l'article dans lequel 
//on veut incrementer un commentaire)
router.patch('/comment-post/:id', postCtrl.commentPost)
//2. Editer des commentaires
router.patch('/edit-comment-post/:id', postCtrl.editCommentPost);
// 3. Supprimer un commentaire
router.patch('/delete-comment-post/:id', postCtrl.deleteCommentPost)


module.exports = router;

