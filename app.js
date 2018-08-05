require('dotenv').config()
const express               = require('express'),
      bodyParser            = require('body-parser'),
      mongoose              = require('mongoose'),
      flash                 = require('connect-flash'),
      expressSession        = require('express-session'),
      passport              = require('passport'),
      LocalStrategy         = require('passport-local'),
      GitHubStrategy        = require('passport-github'),
      methodOverride        = require('method-override'),
      app                   = express();

const PORT = process.env.PORT || 7000;

//const seedDB = require('./seeds');
//seedDB();

//model imports
const Vote = require('./models/poll'),
      User = require('./models/user');

//routes imports
const authentication = require('./routes/authentication');
const votingRoutes = require('./routes/polls');


//mongoose connections
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/voting', {
    keepAlive: true
});


app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(flash());


//Passort and Session
app.use(expressSession({
   secret: 'why do we need it',
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
   res.locals.error = req.flash('error');
   res.locals.success = req.flash('success');
   next();
});

//github login
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_SECRET,
  callbackURL:  'https://wannavoteapp.herokuapp.com/user/signin/callback'
 },
 function(accessToken, refreshToken, profile, done){
   User.findOne({ githubId: profile.username}, function(err, user){
     if(err){
       console.log(err);
     } else if(user === null){
       User.create({username: profile.username}, function(err, newUser){
         if(err){
           console.log(err);
         }else{
           return done(err, newUser);
         }
       });
     }else{
       return done(err, user);
     }
   });
 }
));

//express routes
app.use(authentication);
app.use('/polls', votingRoutes);

//Server Setup
app.listen(PORT, () => {
  console.log(`Serving starting on ${PORT}`);
})
