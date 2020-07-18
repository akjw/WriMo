const router = require("express").Router();
const User = require('../models/user.model');
const Prompt = require("../models/prompt.model");
const Work = require("../models/work.model");
const isLoggedIn = require("../config/blockCheck");


router.get('/dashboard', isLoggedIn, async (req, res) => {
    try {
        let user = await User.findById(req.user._id);
        let prompts = await Prompt.find().populate({path: 'postedBy', match: {_id: req.user._id}})
        let userPrompts = prompts.filter(el => el.postedBy != null)
        let works = await Work.find().populate('attachedTo').populate({path: 'postedBy', match: {_id: req.user._id}})
        let userWorks = works.filter(el => el.postedBy != null)
        res.render('users/dashboard', {user, userPrompts, userWorks})
    } 
    catch (err) { console.log(err) }
})

module.exports = router;