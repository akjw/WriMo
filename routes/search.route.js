const Prompt = require('../models/prompt.model');
const User = require('../models/user.model');
const router = require('express').Router();
const isLoggedIn = require("../config/blockCheck");
const Work = require('../models/work.model');

router.get('/page/:page',  async (req, res) => {
    try {
        //execute if a search query is made
        var searchTerm = req.query.search;
        var noResults = null;
        if(req.query.search) {
            //show matches
          let prompts = await Prompt.find({name: { $regex: req.query.search, $options: 'i'}}, function(err, matchPrompts){
            if(err){
                console.log(err);
            } else {
               if(matchPrompts.length < 1) {
                   console.log('no prompts matching')
               }
            }
         }).populate('postedBy');
          let users =  await User.find({username: { $regex: req.query.search, $options: 'i'}}, function(err, matchUsers){
            if(err){
                console.log(err);
            } else {
                if(matchUsers.length < 1) {
                    console.log('no users matching')
                }
                console.log('all users', matchUsers)
            }
        }).populate('postedBy');
          let works = await Work.find({title: { $regex: req.query.search, $options: 'i'}}, function(err, matchWorks){
            if(err){
                console.log(err);
            } else {
                if(matchWorks.length < 1) {
                    console.log('no works matching')
                }
                console.log('allworks', matchWorks)
            }
        }).populate('postedBy').populate('attachedTo');
           if(prompts.length < 1 && users.length < 1 && works.length < 1){
               noResults = "No matching results."
           }
           console.log('works length', works.length)
           console.log('users length', users.length)
           console.log('prompts length', prompts.length)
            res.render("search/index",{ searchTerm, prompts, users, works, noResults });
        }
    }
    catch(err) {console.log(err)}
   
})

router.get('/suggestions',  (req, res) => {
        //pre-set 'term' property in query object indicates value currently in text input
        var queryTerm = req.query.term
        // trawl user collection for username matches; case-insenstive, include username as a field in results, sort by descending order for timestamps, show only 2 matches
        var userMatches = User.find({username: {$regex: queryTerm, $options: 'i'}}, { 'username': 1}).sort({"updated_at":-1}).sort({"created_at":-1}).limit(2);
        // work title matches
        var workMatches = Work.find({title: {$regex: queryTerm, $options: 'i'}}, { 'title': 1}).sort({"updated_at":-1}).sort({"created_at":-1}).limit(2);
        //prompt name matches 
        var promptMatches = Prompt.find({name: {$regex: queryTerm, $options: 'i'}}, { 'name': 1}).sort({"updated_at":-1}).sort({"created_at":-1}).limit(2);
        Promise.all([userMatches, workMatches, promptMatches]).then((results) => {
            //results returns nested array with values of matches from all 3 models
            //flatten results array so that values can be accessed 
            let allResults = results.flat();
            res.send(allResults, {
                'Content-Type': 'application/json'
            }, 200);
        })
        .catch((err)=>{console.log(err)})
})

module.exports = router;