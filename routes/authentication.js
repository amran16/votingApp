const express               = require('express'),
      router                = express.Router(),
      passport              = require('passport'),
      User                  = require('../models/user');

//root route
router.get('/', (req, res) => {
    res.redirect('/polls');
});

//show sign up form
router.get('/register', (req, res) => {
      res.render('register');
});

//handle sign up logic
router.post('/register', (req, res) => {
    const newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user) => {
      if(err){
      //  console.log(err);
        req.flash('error', err.message);
        res.redirect('/register');
        //return res.render('register');
      }
      passport.authenticate('local')(req, res, () => {
        req.flash('success', 'Successfully Signed Up! Welcome ' + req.body.username);
        res.redirect('/polls');
        //res.send('You are in')
      });
    });
});

//handling login logic
router.get('/signin', (req, res) => {
    res.render('signin');
});

//app.post('/login', middleware, callback) you can remove the callback
router.post('/signin', passport.authenticate('local',
      {
          successRedirect: '/polls' || '/signin',
          failureRedirect: '/signin'
      })
);

// logout route
router.get('/signout', (req, res) => {
     req.logout();
     req.flash('success', 'You are logged out');
     res.redirect('/polls');
});

//GITHUB LOGIN
 router.get('/auth', passport.authenticate('github'));

 router.get('/auth/error', function(req, res){
   res.redirect('/register');
 });

 router.get('/user/signin/callback',
    passport.authenticate('github', { failureRedirect: '/auth/error'}),
    function(req, res){
      // Successful authentication, redirect home.
    res.redirect('/polls');
   }
 );


module.exports = router;
