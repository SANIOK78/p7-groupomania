const mongoose = require('mongoose');
//import du plugin 'uniqueValidator'
const uniqueValidator = require('mongoose-unique-validator');

// Création Schema utilisateur 
const userSchema = mongoose.Schema({
    pseudo: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true}
});

// Application du plugin 'uniqueValidator' au Schema utilisateur
// pour ne pas avoir deux utilisateurs avec la même @email
userSchema.plugin(uniqueValidator);

// Export du model avec le nom 'User'
module.exports = mongoose.model('User', userSchema);