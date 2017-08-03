const mongoose = require('mongoose');

var votingSchema = new mongoose.Schema({
  
   pollTitle: String,
   pollItems: [{name: String, count: Number}]

});


module.exports = mongoose.model('Vote', votingSchema);
