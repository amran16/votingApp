const express    = require('express'),
      router     = express.Router(),
      Vote       = require('../models/poll'),
      middleware = require('../middleware');


//Index Route - Show all polls
router.get('/', (req, res) => {
  //console.log('The user from get/polls: ',req.user); //it contains all the logged in info
  //res.send('hello there')
   Vote.find({}, function(err, allPolls){
     if(err){
       console.log(err)
     }else{
       //console.log('The polls are: ', allPolls)
       res.render('polls/index', {votes : allPolls });
       //res.send(allPolls)
     }
   });
});

//New Route - Show form to create a new vote
router.get('/new', middleware.isLoggedIn, (req, res) =>{
  res.render('polls/new');
});

//Creat Route - add new vote to DB
router.post('/', (req, res) => {
   //get data from form and add to vote array
   //redirect back to votes page
   const pollName = req.body.pollName;
   const pollOption = req.body.pollOption;
   //console.log(pollName);
   //console.log(pollData);
   const author = {
     id: req.user._id,
     username: req.user.username
   }

   const pollData = pollOption.map(item => {
      return { name: item, count: 1 }
   })

   const newVotes = {
     pollTitle: pollName,
     pollItems: pollData,
     author: author
   }

   //console.log(newVotes);

   Vote.create(newVotes, (err, newlyCreated) => {
     if(err){
       console.log(err);
     }else{
       res.redirect('/polls');
     }
   });
});


// Show Route - Shows more info about one vote
router.get('/:id', (req, res) => {
  var id = req.params.id
  //console.log("The show ID:",id)
   Vote.findById(req.params.id).exec((err, foundVote) => {
     if(err){
       console.log(err);
     } else {
       //console.log(foundVote);
       res.render('polls/show', { votes: foundVote });
       //res.send(foundVote)
     }
   });
});

//Vote Route
router.post('/:id', (req, res) => {
  // console.log("The post ID:", req.params.id);
  // console.log("Post Updated Poll:", req.body);
  // console.log("Voted Item:", req.body.item);

  const votedItem = req.body.option;
  Vote.updateOne(
    { 'pollItems._id': votedItem },
    {
      $inc: { 'pollItems.$.count': 1 }
    },

    (err, updatedPoll) => {
      if (err) throw err;
      res.redirect(`/polls/${req.params.id}`);
    }
  );
});

// Edit Poll
router.get('/:id/edit', middleware.checkPollOwnership, (req, res, next) => {
    Vote.findById(req.params.id, (err, foundVote) => {
        if (err) return next(err);
        res.render('polls/edit', { poll: foundVote });

    });
});

//Update poll
router.put('/:id/edit', (req, res, next) => {
  // console.log("the updated Id:", req.params.id);
  // console.log("the req.body is :", req.body);
  // console.log("the updated poll:", req.body.poll);
  Vote.findByIdAndUpdate(req.params.id, req.body.poll, (err, updatedPoll) => {
    if (err) return next(err);
      res.redirect('/polls');
  })
})

//Delete poll
router.delete('/:id', middleware.checkPollOwnership, (req, res, next) => {
  Vote.findByIdAndRemove(req.params.id, err => {
      if (err) return next(err);
      res.redirect('/polls');
  });
});


module.exports = router;
