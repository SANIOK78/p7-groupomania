// importation package permettant d'utiliser variables d'environnement
require('dotenv').config();

// const dotenv = require('dotenv');
// const result = dotenv.config();

const mongoose = require('mongoose');

// connexion a MongoDB
// mongoose.connect('mongodb+srv://Alex:{A_mongo_78}@cluster0.rdygz.mongodb.net/?retryWrites=true&w=majority',
//     { 
//         useNewUrlParser: true,
//         useUnifiedTopology: true 
//     })
// .then(() => console.log('Connexion à MongoDB réussie !'))
// .catch((err) => console.log('Connexion à MongoDB échouée !', err));


// connexion a MongoBd
// mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.mongodb.net/?retryWrites=true&w=majority`,
mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.mongodb.net/groupomania-project`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));


// export 'mongoose'
module.exports = mongoose;

