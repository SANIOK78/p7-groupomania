// import userModel
const UserModel = require('../models/userModel');


// fonction permettant l'inscription
exports.signup = async (req, res, next) => {
    console.log(req.body)

    const {pseudo, email, password} = req.body

    try{
        const user = await UserModel.create({pseudo, email, password});
        res.status(201).json({user: user._id});
    }
    catch(err){
        res.status(200).send({err})  //nvoi erreur dans la console
    }
}

// fonction permettant la connexion 
exports.login = (req, res, next) => {

}