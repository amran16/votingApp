const mongoose = require('mongoose');
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
   username: String,
   password: String,
   ballots: [
     {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Vote'
      }
   ]

});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
