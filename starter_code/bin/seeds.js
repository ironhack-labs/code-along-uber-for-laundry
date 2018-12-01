const mongoose = require("mongoose");
const User = require("../models/user.js");
const bcrypt = require("bcryptjs");
const bcryptSalt = 10;

mongoose
  .connect(
    'mongodb://localhost/uber-for-loundry',
    { useNewUrlParser: true }
  )
  .then(() => console.log("Connected!"));
const makeHash=(password)=>{
  const salt = bcrypt.genSaltSync(bcryptSalt);
  return bcrypt.hashSync(password, salt);
}


const users = [
  {
    name: "Pepe",
    email: "pepe@pepe.com",
    password: makeHash("1234"),
    isLaunderer: false,
    
  },
  {
    name: "Aaron",
    email: "aaron@pepe.com",
    password: makeHash("345443"),
    isLaunderer: false,
    
  },
  {
    name: "Tere",
    email: "tere@pepe.com",
    password: makeHash("56454"),
    isLaunderer: true,
    fee:5
  }
];

User.create(users, err => {
  if (err) {
    throw err;
  }
  console.log(`Created ${users.length} bosses`);
  mongoose.connection.close();
});
