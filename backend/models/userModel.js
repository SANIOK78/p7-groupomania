const mongoose = require('mongoose');
//import du plugin 'uniqueValidator'
const uniqueValidator = require('mongoose-unique-validator');
// fonction qui va controler la validité de @mail
const {isEmail} = require('validator');
const bcrypt = require('bcrypt');

// Création Schema utilisateur 
const userSchema = new mongoose.Schema(
    {
        pseudo: {type: String, required: true, unique: true, trim: true, minLength: 3, maxLength: 55},
        email: {type: String, required: true, unique: true, validate: [isEmail], lowercase: true, trim: true},
        password: {type: String, required: true, max: 1024, minLength: 6 },
        picture: {type: String, default: "./uploads/profil/random-user.png"},  //Photo par defaut d'user
        bio : {type: String, max: 1024},  //description de la personne
        followers: {type: [String]},      //tab des geans qui le suivent
        following: {type: [String]},      //les gens que l'user suive
        likes: {type: [String]},          //es postes liké
    },
    {
        timestamps: true,   //suivit de connexion de l'user
    }
);

// avant d'enregistrer l'user, on cript le password
userSchema.pre('save', async function(next) {
    //on va saler le mot de passe
    const salt = await bcrypt.genSalt();
    //ajout de salage au mot de passe
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Application du plugin 'uniqueValidator' au Schema utilisateur
// pour ne pas avoir deux utilisateurs avec la même @email
userSchema.plugin(uniqueValidator);

// Export du model avec le nom 'User'
module.exports = mongoose.model('User', userSchema);