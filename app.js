require('dotenv').config()
const express               = require('express'),
      bodyParser            = require('body-parser'),
      mongoose              = require('mongoose'),
      seedDB                = require("./seeds"),
      expressSession        = require("express-session"),
      passport              = require("passport"),
      LocalStrategy         = require("passport-local"),
      passportLocalMongoose = require("passport-local-mongoose"),
      //methodOverride        = require("method-override"),
      //cookieParser          = require("cookie-parser"),
      expressSanitizer      = require('express-sanitizer'),
      app                   = express();

seedDB();

//model imports
const Vote = require('./models/poll'),
      User = require('./models/user');

//routes imports
const authentication = require('./routes/authentication');


//mongoose connections
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/voting");
//mongoose.connect("mongodb://localhost/voting");


app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));

//Passort and Session
app.use(expressSession({
   secret: "This is the voting app",
   resave: false,
   saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//This is a middleware that will run on every template
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

//express routes
app.use(authentication);

// Vote.create(
//   {
//       pollTitle: 'Favorite Color',
//          pollItems: [
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
app.post('/votes', isLoggedIn, (req, res) => {
   //get data from form and add to vote array
   //redirect back to votes page
   var pollName = req.body.pollName;
   var pollOption = req.body.pollOption.split(',');
   var pollData = [];

   for(var i = 0; i < pollOption.length; i++){
     pollData.push({name: pollOption[i], count:1});
   }
    //console.log(pollName);
    //console.log(pollData);
   var newVotes = {pollTitle: pollName, pollItems: pollData}
   //console.log(newVotes);

   Vote.create(newVotes, (err, newlyCreated) => {
     if(err){
       console.log(err);
     }else{
       res.redirect('/votes');
     }
   });
   //res.send('You hit the POST route')
});

// NEW ROUTE - Show form to create new vote
app.get('/votes/new', isLoggedIn, (req, res) =>{
  res.render('new');
});

// SHOW ROUTE - Shows more info about one vote
app.get('/votes/:id', (req, res) => {
  //find the vote with provided ID in mongoDB
  //it doesn't have to be :id, it could be anything, like name, thing...

   //Vote.findById(req.params.id).populate('users').exec((err, foundVote) => {
   Vote.findById(req.params.id, (err, foundVote) =>{
     if(err){
       console.log(err);
     } else {
       var newArray = [];
       for(var i = 0; i < foundVote.pollItems.length; i++){
         newArray.push([foundVote.pollItems[i].name, foundVote.pollItems[i].counts]);
       }
       //console.log(foundVote);
       res.render('show', {foundVote: foundVote, newArray: newArray})
     }
   });
});

  //Add new polls to the vote
  app.post('/votes/:id', (req, res) => {
    const ballot = req.body.ballot;
    const id  = req.params.id;
    const pollArray = [];
    // console.log(req.params.id);
    // console.log(req.body.vote);
    Vote.findById(id, function(err, foundVote){
      if(err){
        console.log(err);
      } else {
        for(var i = 0; i < foundVote.pollItems.length; i++){
          if(foundVote.pollItems[i].name === ballot){
             foundVote.pollItems[i].count += 1;
             foundVote.save();
          }
          pollArray.push([foundVote.pollItems[i].name, foundVote.pollItems[i].count]);
        }
        //console.log(pollArray);
        res.redirect('/votes/' + id);
      }
    })
    //res.send('vote submitted?');
  });

  // app.post('/votes/:id/addedVote', (req, res) =>{
  //   res.render('new');
  // });

  function isLoggedIn(req, res, next){
      if(req.isAuthenticated()){
          return next();
      }
      res.redirect('/login');
  }



app.listen(5000, () => {
  console.log("voting app running on 5000");
});
