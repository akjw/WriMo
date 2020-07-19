const Prompt = require('../models/prompt.model');
const User = require('../models/user.model');
const router = require('express').Router();
const isLoggedIn = require("../config/blockCheck");
const Work = require('../models/work.model');

router.get('/',  async (req, res) => {
    try {
        var noResults = null;
        if(req.query.search) {
            //show matches
          let prompts =  await Prompt.find({name: { $regex: req.query.search, $options: 'i'}}, function(err, matchPrompts){
                if(err){
                    console.log(err);
                } else {
                   if(matchPrompts.length < 1) {
                       console.log('no prompts matching')
                   }
                }
             }).populate('postedBy');
          let users =  await User.find({name: { $regex: req.query.search, $options: 'i'}}, function(err, matchUsers){
                if(err){
                    console.log(err);
                } else {
                    if(matchUsers.length < 1) {
                        console.log('no users matching')
                    }
                }
            }).populate('postedBy');
          let works =  await Work.find({title: { $regex: req.query.search, $options: 'i'}}, function(err, matchWorks){
                if(err){
                    console.log(err);
                } else {
                    if(matchWorks.length < 1) {
                        console.log('no works matching')
                    }
                }
            }).populate('postedBy');
            
           if(prompts.length < 1 && users.length < 1 && works.length < 1){
               noResults = "No matching results."
           }
           console.log('prompts', prompts);
           console.log('users', users);
           console.log('works', works)
            res.render("search/index",{ prompts, users, works, noResults});
        }
    }
    catch(err) {console.log(err)}
   
})

module.exports = router;