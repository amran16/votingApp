const mongoose = require('mongoose');

var votingSchema = new mongoose.Schema({
   polls: String,
   items: [
     {name: String, count: Number}
   ]

});

module.exports = mongoose.model('Vote', votingSchema);
