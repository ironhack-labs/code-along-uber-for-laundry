const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  email:String,
  name: String,
  password: String,
  isLaunderer: {type:Boolean,default:false},
  fee:{type:Number,default:0}
}, {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;