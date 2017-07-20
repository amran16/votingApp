const express = require('express'),
      mongoose = require('mongoose'),
      bodyParser = require('body-parser');

 var app = express();

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/nightlife");

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) =>{res.send('is it connected')});





app.listen(5000, (req, res)=> {console.log("votling app running on 5000")});


    