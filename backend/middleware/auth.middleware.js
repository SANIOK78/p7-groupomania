const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');

// verification si user est connecté, bien identifié, avec
//son token unique, avec sa clé secrete
module.exports.checkUser = (req, res, next) => {
    const token = req.cookies.jwt;
    if(token) {
        jwt.verify(token, 'RANDOM_TOKEN_SECRET', async(err, decodedToken) => {
            if (err) {    //s'il y une erreur
                res.locals.user = null;
                res.cookie('jwt', '', {maxAge: 1});
                next();

            } else {   //pas d'erreurs               
                let user = await UserModel.findById(decodedToken.id);
                res.locals.user = user;
                // console.log(res.locals.user)
                next();
            }
        })
    } else {
        res.locals.user = null;
        next();
    }
}

//quand l'user arrive pour la 1ere fois sur notre app
//verification si on conner son token pour le connecter
module.exports.requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    if(token) {
        jwt.verify(token, 'RANDOM_TOKEN_SECRET', async(err, decodedToken) => {
            if (err) {
                console.log(err);

            } else {
                console.log(decodedToken.id);
                next();
            }
        });
    } else {
        console.log('No Token !!!')
    }
} 
