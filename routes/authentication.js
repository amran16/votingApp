const express               = require("express"),
      router                = express.Router(),
      bodyParser            = require("body-parser"),
      mongoose              = require("mongoose"),
      LocalStrategy         = require("passport-local"),
      passport              = require("passport"),
      User                  = require("../models/user"),
      passportLocalMongoose = require("passport-local-mongoose"),
      //methodOverride        = require("method-override"),
      //cookieParser          = require("cookie-parser"),
      expressSession        = require("express-session"),
      expressSanitizer      = require('express-sanitizer');


 //show sign up form
 router.get('/register', (req, res) =>{
      res.render('register');
  });

  //handle sign up logic
  router.post('/register', (req, res) => {
    const newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user) => {
      if(err){
        console.log(err);
        return res.render('register');
      }
      passport.authenticate('local')(req, res, () => {
        res.redirect('/');
      });
    });
  });

  //handling login logic
  router.get('/login', (req, res) => {
    res.render('login');
  });

//app.post('/login', middleware, callback) you can remove the callback
  router.post('/login', passport.authenticate('local',
      {
          successRedirect: '/',
          failureRedirect: '/login'
      }));


  // logout route
  router.get('/logout', (req, res) => {
     req.logout();
     res.redirect('/');
  });

  function isLoggedIn(req, res, next){
      if(req.isAuthenticated()){
          return next();
      }
      res.redirect('/login');
  }


module.exports = router;
