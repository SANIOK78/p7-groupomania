// en cas d'erreur 'signUp' on affiche des message personnalisés
module.exports.signUpErrors = (err) => {
    let errors = {pseudo: '', email: '', password: ''}

    if(err.message.includes('pseudo')) {
        errors.pseudo = "Pseudo incorrect ou déjà pris !";
    }
     
    if(err.message.includes('email')){
        errors.email = "Email incorrect ou déjà pris !";
    }

    if(err.message.includes('password')){
        errors.password = "Le mot de passe doit faire 6 caractères minimum !";
    }

    //cas ou les identifiant sont prises (en double:  'code=11000')
    if(err.code === 11000 && Object.keys(err.keyValue)[0].includes('pseudo')){
        errors.pseudo = "Ce pseudo est déjà pris !";
    }

    if(err.code === 11000 && Object.keys(err.keyValue)[0].includes('email')){
        errors.email = "Cet email est déjà enregistré !";
    }
    return errors;
}

// En cas d'erreurs de 'signIn' de connexion
module.exports.signInErrors = (err) => {
    let errors = { email: '', password: '' }

    //si l'erreur concerne l'email
    if (err.message.includes('email')) {
        errors.email = "Email inconnu !";
    }

    if (err.message.includes('password')) {
        errors.password = "Le mot de passe ne corresponde pas !";
    }

    return errors;
}

// Cas d'erreur de téléchargement fichiers
module.exports.uploadErrors = (err) => {
    let errors = {format: '', maxSize: ''};

    if (err.message.includes('invalid file')){
        errors.format = "Format incompatible";
    }
    if (err.message.includes('max size')) {
        errors.maxSize = "Le fichier dépasse 500Ko";
    }
    return errors
}