const Vote = require("../models/poll");


module.exports = {
    isLoggedIn: (req, res, next) => {
        if(req.isAuthenticated()){
            return next();
        }
        req.flash("error", "You must be signed in to do that!");
        res.redirect("/signin");
        //res.send('Signin First');
    },

     checkPollOwnership: (req, res, next) => {
       if(req.isAuthenticated()){
           Vote.findById(req.params.id, (err, foundVote) => {
             if(err){
               res.redirect("back");
             }else {
               // console.log('The author is: ', foundVote.author.id); //its a moongo object
               // console.log('The currentUser is: ', req.user._id);
               if(foundVote.author.id.equals(req.user._id)){
                 next();
                 //res.render('polls/edit', { poll: foundVote });
               }
             }
         });
       }
     }

}

// middlewareObj.checkPollOwnership = (req, res, next) => {
//   if(req.isAuthenticated()){
//       Vote.findById(req.params.id, (err, foundVote) => {
//         if(err){
//           res.redirect("back");
//         }else {
//           // console.log('The author is: ', foundVote.author.id); //its a moongo object
//           // console.log('The currentUser is: ', req.user._id);
//           if(foundVote.author.id.equals(req.user._id)){
//             next();
//             //res.render('polls/edit', { poll: foundVote });
//           }
//         }
//     });
//   }
// };
//
// middlewareObj.isLoggedIn = (req, res, next) => {
//     if(req.isAuthenticated()){
//         return next();
//     }
//     req.flash("error", "You must be signed in to do that!");
//     res.redirect("/signin");
//     //res.send('Signin First');
// }

//module.exports = middlewareObj;
