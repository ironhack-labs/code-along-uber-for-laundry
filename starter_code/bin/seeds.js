const mongoose    = require('mongoose');
const User        = require('../models/user');
const faker       = require('faker');
const bcrypt      = require('bcrypt');


function createUser() {
  let newUser = {};
  let firstName = faker.name.firstName();
  let lastName = faker.name.lastName();
  let password = faker.lorem.word();
  newUser.name = `${firstName} ${lastName}`;
  newUser.email = firstName + "." + lastName + "@" + faker.internet.domainName();
  newUser.password = bcrypt.hashSync( password, bcrypt.genSaltSync(8) );
  console.log( "SEEDS -> NEW USER", newUser );
  return newUser;
}

// create 10 standard users
let usersList = [];
for (let i = 0; i < 10; i++) {
  let newUser = createUser();
  usersList.push( newUser );
}

// create 20 launderers
let laundryList = [];
for (let i = 0; i < 20; i++) {
  let newLaundry = createUser();
  newLaundry.isLaunderer = true;
  const fees = [10.00,10.50,10.75,10.25,11.00,11.25,11.50];
  newLaundry.fee = fees[ Math.floor(Math.random() * fees.length) ];
  laundryList.push( newLaundry );
}

const list = usersList.concat( laundryList );

// insert new users into the DB
mongoose.connect('mongodb://localhost/uber-for-loundry')
.then( () => {
  console.log('Connected to Mongo!')
  User.collection.drop();
  User.insertMany( list )
  .then( newUsers => {
    console.log( `${newUsers.length} new users created`, newUsers );
    User.create( {
      name: "Silvio",
      email: "silvio.galli@gmail.com",
      password: bcrypt.hashSync( "silvio", bcrypt.genSaltSync(8) )
    } )
    .then( me => {
      console.log("Added my user:", me);
      mongoose.disconnect();
    } )
  })
})
.catch( err => {
  console.error('ERROR: ------>>', err)
});


