require('dotenv').config()
const express        = require('express'),
      bodyParser     = require('body-parser'),
      mongoose       = require('mongoose');
      // Vote           = require('./models/poll'),
      // User           = require('./models/user'),
      // seedDB         = require("./seeds");


const app = express();

//seedDB();
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/votingapp");
//mongoose.connect('mongodb://localhost/votingapp');

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));

var votingSchema = new mongoose.Schema({
   pollName: String,
   items: [
     {name: String, count: Number}
   ]
});
var Vote = mongoose.model('Vote', votingSchema);

// Vote.create({
//       pollName: 'Favorite Food',
//          items: [
//             {name: 'Rice', count: 3},
//             {name: 'Pasta', count: 2},
//             {name: 'Noodle', count: 1},
// ]
// });

app.get('/', (req, res) => {
  res.redirect('/votes');
});

//Index Route - Show all the votes
app.get('/votes', (req, res) => {
   Vote.find({}, function(err, polls){
     if(err){
       console.log(err)
     }else{
       console.log(polls)
       res.render('index', {polls : polls});
       //res.send(polls)
     }
   });
});

// CREATE ROUTE - add new vote to DB
app.post('/votes', (req, res) => {
   //get data from form and add to vote array
   //redirect back to votes page
   var pollName = req.body.pollName;
   var pollOptions = req.body.pollOptions.split(',');

   var newVotes = {pollName: pollName, pollOptions:pollOptions}

   Vote.create(newVotes, function(err, newVotes){
     if(err){
       console.log(err);
     }else{
       res.redirect('/votes');
     }
   });
   //res.send('You hit the POST route')
});

// NEW ROUTE - Show form to create new vote
app.get('/votes/new', function(req, res){
  res.render('new');
});

// SHOW ROUTE - Shows more info about one vote
app.get('/votes/:id', function(req, res){
   Vote.findById(req.params.id, function(err, foundVote){
     if(err){
       console.log(err);
     } else {
       res.render('show', {polls: foundVote})
     }
   });
});




app.listen(5000, (req, res)=> {
  console.log("votling app running on 5000")
});
