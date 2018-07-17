const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
  // local: {
      email: String,
      password: String,
  // },
  // facebook:{
      id: String,
      token: String,
      name: String
  // }
});
module.exports = mongoose.model('User',userSchema);
