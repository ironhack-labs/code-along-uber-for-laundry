

const mongoose =  require('mongoose');

const User = require('../models/User');

const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);
const hashPass = bcrypt.hashSync("1234", salt);


mongoose.connect('mongodb://localhost/uber-laundry', {useNewUrlParser: true})
  .then(() => console.log(`Connected to uber-laundry!`));

const users = [
  {
    name: 'Perico',
    email: 'pericon@hotmail.com',
    password: hashPass,
  },
  {
    name: 'Marta',
    email: 'marta@hotmail.com',
    password: hashPass,
  },
  {
    name: 'Esther',
    email: 'esther@hotmail.com',
    password: hashPass,
  }
];

User.collection.drop();

User.create(users)
  .then(users => {
    console.log(`Created users!`);
  }).then(() => {mongoose.disconnect()});
