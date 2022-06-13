// import model utilisateurs
const UserModel = require('../models/userModel');
//verifications si les 'ID' sont reconnus par la BD
const ObjectID = require('mongoose').Types.ObjectId;

// fonction permettant d'afficher les utilisateurs
module.exports.getAllUsers = async (req, res) => {

    // selectionne et renvoit tous, sauf le password 
    const users = await UserModel.find().select('-password');

    res.status(200).json(users);   
}

// fonction permettant d'afficher un utilisateur
module.exports.getOneUser = (req, res) => {
    console.log(req.params)

    if(!ObjectID.isValid(req.params.id)) {
        return res.status(400).send('ID inconnus : ' + req.params.id)
    }
    UserModel.findById(req.params.id, (err, data) => {
        // si pas d'erreurs remontés
        if(!err) res.send(data);
        else console.log('ID unknown: ' + err);

    }).select('-password');  //ne retourne pas le mot de passe
}

// fonction permettant la mise a jour d'un utilisateur
module.exports.updateUser =  (req, res) => {
    //test si l'ID passé en params est correct
    if(!ObjectID.isValid(req.params.id)) {
        return res.status(400).send('ID inconnus : ' + req.params.id)
    }

    try {
        UserModel.findOneAndUpdate(    //cherche objet avec l'élément
            {_id: req.params.id},            //l'ID qui sera celui passé en parametres
            {
                $set: {                      //modification de 'bio' 
                    bio: req.body.bio
                }
            },
            // parametrage quand on fait un requête PUT
            { new: true, upsert: true, setDefaultsOnInsert: true},
            // en cas d'erreur
            (err, data) => {
                if(!err) return res.send(data);
                if(err) return res.status(500).send({message: err});
            }
        )
    } catch(err) {
        return res.status(500).json({message: err});
    };
};