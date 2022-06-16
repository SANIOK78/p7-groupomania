const UserModel = require('../models/userModel');
const fs = require('fs');
const {promisify } = require('util');
const { uploadErrors } = require('../utils/errorsUtils');
const pipeline = promisify(require('stream').pipeline);


module.exports.uploadProfil = async (req, res) => {
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

    // création du nom du fichier
    const fileName = req.body.name + ".jpg";

    await pipeline(req.file.stream, 
        fs.createWriteStream(
         // on indique le chaimin ou stocker le fichier
            `${__dirname}/../client/public/uploads/profil/${fileName}`
        )
    );

    // enregistrement de chaimin dans BD
    try {
        await UserModel.findByIdAndUpdate(
            req.body.userId,
            {$set: {picture : "./uploads/profil/" + fileName}},
            {new: true, upsert: true, setDefaultsOnInsert: true},
            (err, docs) => {
                if(!err) return res.status(200).send(docs);
                else return res.status(500).send({message: err});
            }
        );
    } catch(err) {
        return res.status(500).send({message: err});
    }
};