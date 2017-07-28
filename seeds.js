const mongoose = require('mongoose'),
      Vote     = require('./models/poll');


var data = [
  {
    pollName: 'Favorite City',
    items: [
      {name: 'Oakland', count: 3},
      {name: 'Berkeley', count: 2},
      {name: 'San Francisco', count: 1},
    ]
  },
  {
    pollName: 'Favorite Food',
    items: [
      {name: 'Rice', count: 3},
      {name: 'Pasta', count: 2},
      {name: 'Noodle', count: 1},
    ]
  },
  {
    pollName: 'Favorite Drink',
    items: [
      {name: 'Water', count: 3},
      {name: 'Tea', count: 1},
      {name: 'Coffee', count: 1},
    ]
  }
]

function seedDB(){
  Vote.remove({}, function(err){
    if(err){
      console.log(err);
    }
    console.log('removed votes!');
    data.forEach(function(seed){
      Vote.create(seed, function(err, addedData){
        if(err){
          console.log(err)
        }else{
          console.log('added: ' + seed.pollName)
        }
      })
    });
  });
}



module.exports = seedDB;
