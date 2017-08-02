require('dotenv').config()
var express        = require('express'),
      bodyParser     = require('body-parser'),
      mongoose       = require('mongoose');
      // Vote           = require('./models/poll'),
      // User           = require('./models/user'),
      // seedDB         = require("./seeds");


var app = express();

//seedDB();
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/voting");
//mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/voting");

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));

var votingSchema = new mongoose.Schema({
   pollTitle: String,
   pollItems: [{name: String, count: Number}]
});
var Vote = mongoose.model('Vote', votingSchema);

// Vote.create(
//   {
//       pollName: 'Favorite Color',
//          pollOption: [
//             {name: 'Yellow', count: 3},
//             {name: 'Green', count: 2},
//             {name: 'Red', count: 1},
//                  ]
//   }, function(err, vote){
//     if(err){
//       console.log(err);
//     } else{
//       console.log('Newly Created Poll');
//       console.log(vote);
//     }
// });

// Vote.create(
//   {
//       pollName:    'Favorite Quote',
//       pollOption:  'A man was given 10,000 and he gave back the rest n said give the rest to others in need'
//   }, function(err, vote){
//     if(err){
//       console.log(err);
//     } else{
//       console.log('Newly Created Poll');
//       console.log(vote);
//     }
// });

app.get('/', (req, res) => {
  res.redirect('/votes');
});

//Index Route - Show all the votes
app.get('/votes', (req, res) => {
   Vote.find({}, function(err, allPolls){
     if(err){
       console.log(err)
     }else{
       //console.log(allPolls)
       res.render('index', {votes : allPolls});
       //res.send(votes)
     }
   });
});

// CREATE ROUTE - add new vote to DB
app.post('/votes', (req, res) => {
   //get data from form and add to vote array
   //redirect back to votes page
   var pollName = req.body.pollName;
   var pollOption = req.body.pollOption.split(',');
   var pollData = [];

   for(var i = 0; i < pollOption.length; i++){
     pollData.push({name: pollOption[i], count:1});
   }

    console.log(pollName);
    console.log(pollData);

   var newVotes = {pollTitle: pollName, pollItems: pollData}
   //console.log(newVotes);

   Vote.create(newVotes, function(err, newlyCreated){
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
  //find the vote with provided ID in mongoDB
  //it doesn't have to be :id, it could be anything, like name, thing...
   Vote.findById(req.params.id, function(err, foundVote){
     if(err){
       console.log(err);
     } else {
       var newArray = [];
       for(var i = 0; i < foundVote.pollItems.length; i++){
         newArray.push([foundVote.pollItems[i].name, foundVote.pollItems[i].counts]);
       }
       res.render('show', {foundVote: foundVote, newArray: newArray})
     }
   });
  //res.send('You hit the SHOW route')
});

app.listen(5000, function(){
  console.log("voting app running on 5000");
});
