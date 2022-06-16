// import userModel
const UserModel = require('../models/userModel');
// import module jsonwebToken
const jwt = require('jsonwebtoken');
const { signUpErrors, signInErrors} = require('../utils/errorsUtils');



const maxAge = 3 * 24 * 60 * 60 * 1000  //valable 3 jours
// fonction permettant de créer/générer un token
const createToken = (id) => {
    return jwt.sign(
        {id},
        'RANDOM_TOKEN_SECRET',  //clé secrete
        {expiresIn: maxAge}
    );
}

// fonction permettant l'inscription
module.exports.signUp = async (req, res) => {
    const {pseudo, email, password} = req.body

    try{
        const user = await UserModel.create({pseudo, email, password});
        res.status(201).json({user: user._id});
    }
    catch(err){
        // récup de l'erreur survenu a l'inscription d'un user
        const errors = signUpErrors(err)
        res.status(200).json({errors})  
    }
}


// fonction permettant la connexion 
module.exports.signIn = async (req, res) => {
    const {email, password} = req.body;

    try {
        // on récupère dans BD le user avec mail et password 
        //correspondant au saisi depuis body 
        const user = await UserModel.login(email, password);
        //création du token
        const token = createToken(user._id);
        // utilisation du token: on créer un cookie
        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge})
        res.status(200).json({ user: user._id})
    } 
    catch(err) {
        // récup de l'erreur survenu a la connexion d'un user
        const errors = signInErrors(err)
        res.status(200).json({errors}) 
    }
}

// fonction permattant la deconnexion
module.exports.logout = (req, res) => {
    // on retire les cookies
    res.cookie('jwt', '', {maxAge: 1});    
    res.redirect('/');
}