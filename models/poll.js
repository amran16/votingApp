const mongoose = require('mongoose');

var votingSchema = new mongoose.Schema({

   pollTitle: String,
   dateCreated: {type: Date, default: Date.now},
   pollItems: [
      {
        name: String,
        count: Number
      }
    ],

   author: {
     id: {
       type: mongoose.Schema.Types.ObjectId,
       ref: 'User'
     },
     username: String
   }
});


module.exports = mongoose.model('Vote', votingSchema);
