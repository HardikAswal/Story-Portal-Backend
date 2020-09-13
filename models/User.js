const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  username: {
    type: String,
    required:true,
    unique:true
  },
  password: {
    type:String,
    minlength: 15
  }
});
module.exports = User = mongoose.model("users", UserSchema);
