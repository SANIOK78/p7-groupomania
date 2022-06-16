// récupération du postModel
const PostModel = require('../models/postModel');
// récupération du userModel
const UserModel = require('../models/userModel');
const fs = require('fs');
const {promisify } = require('util');
const { uploadErrors } = require('../utils/errorsUtils');
const pipeline = promisify(require('stream').pipeline);
// récup 'ObjectId' 
const ObjectID = require('mongoose').Types.ObjectId;

// fonction permettant l'affichage des posts
module.exports.readPost = (req, res) => {
    PostModel.find((err, data) => {
        if(!err) res.send(data); 
        else console.log('Error to get data : ' + err);
      //Triage de plus recente au plus ancien
    }).sort({ createdAt: -1}); 
};

// fonction permettant la creation des posts
module.exports.createPost = async (req, res) => {
    // traitement de 'req.file'
    let fileName;
    if(req.file !== null) {
        try {
            // verification format image
            if (req.file.detectedMimeType !== 'image/jpg' &&
                req.file.detectedMimeType !== 'image/jpeg' &&
                req.file.detectedMimeType !== 'image/png') {
    
                throw Error("invalid file");
            } 
            // verif taille
            if (req.file.size > 500000) throw Error("max size");
    
        } catch(err) {
            const errors = uploadErrors(err)
            return res.status(201).json({errors});
        }
    
        //si pas d'erreur le fileName prend l'idée d'user qui a posté
        //au moment precis + extention
        fileName = req.body.posterId + Date.now() + '.jpg';

        // création du fichier
        await pipeline(req.file.stream, 
            fs.createWriteStream(
             // on indique le chaimin ou stocker le fichier
                `${__dirname}/../client/public/uploads/posts/${fileName}`
            )
        );
    }

    // paramétrage du nouveau post
    const newPost = new PostModel({
        posterId: req.body.posterId,
        message: req.body.message,
        picture: req.file !== null ? "./uploads/posts/" + fileName : "",
        video: req.body.video,
        likers: [],
        comments: []
    });

    // enregistrement du post dans BD
    try {
        const post = await newPost.save()
        return res.status(201).json(post);

    } catch(err) {
        return res.status(400).send(err);
    }
}

// fonction permettant la mise a jour des posts
module.exports.updatePost = (req, res) => {
    // test si ObjectID n'est pas passé en paramétre
    if(!ObjectID.isValid(req.params.id)) {
        return res.status(400).send("ID inconnu : " + req.params.id)
    }
    
    // si ok, enregistrement de la mise a jour
    const updatedRecord = {
        message: req.body.message
    }

    PostModel.findByIdAndUpdate(
        req.params.id,
        {$set: updatedRecord},
        {new: true},
        (err, data) => {
            if(!err) {
                return res.send(data);
            } else {
                console.log("Erreur de mise à jour : " + err); 
            }
        }
    )
}

// fonction permettant la suppression des posts
module.exports.deletePost = (req, res) => {
    // test si ObjectID n'est pas passé en paramétre
    if(!ObjectID.isValid(req.params.id)) {
        return res.status(400).send("ID inconnu : " + req.params.id)
    }

    PostModel.findByIdAndRemove (req.params.id, (err, data) => { 
        if(!err) {
            return res.send(data);
        } else {
            console.log("Erreur de suppression : " + err); 
        }
    });    
};

// fonction permettant d'enregistrer les 'likes'
module.exports.likePost = async (req, res) => {
    // test si ObjectID n'est pas passé en paramétre
    if(!ObjectID.isValid(req.params.id)) {
        return res.status(400).send("ID inconnu : " + req.params.id)
    }

    try {
        // On rajout le user/lakers du post
        await PostModel.findByIdAndUpdate(
            {_id: req.params.id},
            // on le rajout au tab des post ('likers') 
            {$addToSet : {likers: req.body.id}},
            {new: true},
        )
        .then(data => res.send(data))
        .catch(err => res.status(400).send(err));

        // On rajoute  le post liké 
        await UserModel.findByIdAndUpdate(
            req.body.id,
            // on le rajout l'idée du post au tab d'user ('likes')
            {$addToSet : {likes : req.params._id }},
            {new: true},
        )
        .then(data => res.send(data))
        .catch(err => res.status(400).send(err));

    } catch(err) {
        return res.status(400).send(err);
    }
};


// fonction permettant d'enregistrer les 'disLikes'
module.exports.unlikePost = async (req, res) => {
    // test si ObjectID n'est pas passé en paramétre
    if(!ObjectID.isValid(req.params.id)) {
        return res.status(400).send("ID inconnu : " + req.params.id)
    }

    try {
        // On rajout le user/lakers du post
        await PostModel.findByIdAndUpdate(
            req.params.id,
            // on le rajout au tab des post ('likers') 
            {$pull: {likers: req.body.id}},
            {new: true},
        )
        .then(data => res.send(data))
        .catch(err => res.status(400).send(err));

        // On rajoute  le post liké 
        await UserModel.findByIdAndUpdate(
            req.body.id,
            // on le rajout l'idée du post au tab d'user ('likes')
            {$pull : {likes : req.params._id }},
            {new: true},
        )
        .then(data => res.send(data))
        .catch(err => res.status(400).send(err));

    } catch(err) {
        return res.status(400).send(err);
    }
};

// fonction permettant de laisser un commentaire
module.exports.commentPost = (req, res) => {
    if(!ObjectID.isValid(req.params.id)) {
        return res.status(400).send("ID inconnu : " + req.params.id)
    }

    try {
        return PostModel.findByIdAndUpdate(
            req.params.id,
            {
                $push: {
                    comments : {
                        commenterId: req.body.commenterId,
                        commenterPseudo: req.body.commenterPseudo,
                        text: req.body.text,
                        timestamp: new Date().getTime()
                    },                   
                },
            },
            {new : true},
            (err, docs) => {
                if(!err)  return res.send(docs);
                else return res.status(400).send(err)
            }
        )
        // .then(data => res.send(data))
        // .catch(err => res.status(400).send(err));

    } catch(err) {
        return res.status(400).send(err);
    }
};

// fonction permettant de laisser un commentaire
module.exports.editCommentPost = (req, res) => {
    if(!ObjectID.isValid(req.params.id)) {
        return res.status(400).send("ID inconnu : " + req.params.id)
    }

    try {
        return PostModel.findById(req.params.id,  (err, docs) => {            
            const commentaire = docs.comments.find((comment) => {
                // récup ID du commentaire 
                comment._id.equals(req.body.commentId)
            } );

            // si pas de 'commentaire' dans BD
            if(!commentaire) {
                return res.status(404).send('Aucun commentaires trouvées');
            } else {
                //On lui inject un text depuis body
                commentaire.text = req.body.text;                        
            }
        
            // on sauvegard 
            return docs.save((err) => {
                if(!err) {
                    return res.status(200).send(docs);
                } else {
                    return res.status(500).send(err);
                }
            });          
        });
    } catch(err){
        return res.status(400).send(err);
    }
}

// fonction permettant de laisser un commentaire
module.exports.deleteCommentPost = (req, res) => {
    if(!ObjectID.isValid(req.params.id)) {
        return res.status(400).send("ID inconnu : " + req.params.id)
    }

    try {
        return PostModel.findByIdAndUpdate(req.params.id, 
            {
                $pull: {
                    comments: {
                        _id: req.body.commentId,
                    },
                },
            },
            {new: true},
            (err, docs) => {
                if(!err) return res.send(docs);
                else return res.status(400).send(err)
            }
    
        )
    } catch(err) {
        return res.status(400).send(err);
    }
};

