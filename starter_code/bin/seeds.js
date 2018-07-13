
const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcrypt');

mongoose.connect('mongodb://localhost/uber-for-loundry', {useMongoClient: true})
.then(() => {
    User.collection.drop();

    const salt = bcrypt.genSaltSync(10);
    const hashPass = bcrypt.hashSync('1234', salt);

    const users = [
        {name: 'Ruben', email: 'ruben@gmail.com', password: hashPass},
        {name: 'Pepe', email: 'pepe@gmail.com', password: hashPass},
        {name: 'Antonio', email: 'antonio@gmail.com', password: hashPass},
        {name: 'Maria', email: 'maria@gmail.com', password: hashPass, isLaunderer: true, fee: 10},
        {name: 'Sandra', email: 'sandra@gmail.com', password: hashPass, isLaunderer: true, fee: 10},
        {name: 'Cintia', email: 'cintia@gmail.com', password: hashPass, isLaunderer: true, fee: 10}
    ]

    return User.insertMany(users)
})
.then(users => {
    mongoose.disconnect();
})