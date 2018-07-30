const mongoose = require('mongoose'),
          Vote = require('./models/poll'),
          User = require('./models/user');


var data = [
  {
    pollTitle: 'Favorite City',
    pollItems: [
      {name: 'Oakland', count: 1},
      {name: 'Berkeley', count: 1},
      {name: 'San Francisco', count: 1},
    ]
  },
  {
    pollTitle: 'Favorite Food',
    pollItems: [
      {name: 'Rice', count: 1},
      {name: 'Sandwich', count: 1},
      {name: 'Chiken', count: 1},
    ]
  },
  {
    pollTitle: 'Favorite Drink',
    pollItems: [
      {name: 'Water', count: 1},
      {name: 'Tea', count: 1},
      {name: 'Coffee', count: 1},
    ]
  }
]

seedDB = () => {
  Vote.remove({}, (err) => {
    if(err){
      console.log(err);
    }
    console.log('removed votes!');
    // data.forEach(seed => {
    //   Vote.create(seed, (err, addedVotes) => {
    //     if(err){
    //       console.log(err)
    //     }else{
    //       console.log('added: ' + seed.pollTitle)
    //     }
    //   })
    // });
  });
}
module.exports = seedDB;
