const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
   username: String,
   password: String,
   votes: [
     {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Vote'
      }
   ]

});

module.exports = mongoose.model('User', userSchema);
