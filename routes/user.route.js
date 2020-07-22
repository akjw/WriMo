const router = require("express").Router();
const User = require('../models/user.model');
const Prompt = require("../models/prompt.model");
const Work = require("../models/work.model");
const isLoggedIn = require("../config/blockCheck");


router.get('/dashboard', isLoggedIn, async (req, res) => {
    try {
        console.log(req.user)
        let user = await User.findById(req.user._id);
        let loggedUser = user;
        let prompts = await Prompt.find().populate({path: 'postedBy', match: {_id: req.user._id}})
        let userPrompts = prompts.filter(el => el.postedBy != null)
        let works = await Work.find().populate('attachedTo').populate({path: 'postedBy', match: {_id: req.user._id}})
        let userWorks = works.filter(el => el.postedBy != null)
        res.render('users/dashboard', {loggedUser, user, userPrompts, userWorks})
    } 
    catch (err) { console.log(err) }
})

router.get('/:id/dashboard', async (req, res) => {
    try {
        let user = await User.findById(req.params.id);
        let loggedUser = req.user;
        let prompts = await Prompt.find().populate({path: 'postedBy', match: {_id: req.params.id}})
        let userPrompts = prompts.filter(el => el.postedBy != null)
        let works = await Work.find().populate('attachedTo').populate({path: 'postedBy', match: {_id: req.params.id}})
        let userWorks = works.filter(el => el.postedBy != null)
        res.render('users/dashboard', {loggedUser, user, userPrompts, userWorks})
    } 
    catch (err) { console.log(err) }
})

router.get('/:workid/remove-from/:promptid', async (req, res) => {
    try{
        console.log('hi')
    }
    catch (err) { console.log(err)}
})

router.post('/:workid/remove-from/:promptid', async (req, res) => {
    try{
        await Work.findByIdAndUpdate(req.params.workid, {$set: {attachedTo: null}})
        await Prompt.findByIdAndUpdate(req.params.promptid, { $inc : {worksNum: -1} });
        res.redirect('/user/dashboard')
    }
    catch (err) { console.log(err)}
})


router.get('/export-to/:promptid', async (req, res) => {
    try{
        let loggedUser = req.user;
        let addToPrompt = req.params.promptid
        let works = await Work.find().populate('attachedTo').populate({path: 'postedBy', match: {_id: loggedUser._id}})
        let unattachedWorks= works.filter(el => el.postedBy != null && el.attachedTo == null)
        res.render('users/export', { loggedUser, unattachedWorks, addToPrompt})
    }
    catch (err) { console.log(err)}
})

router.post('/export-to/:promptid', async (req, res) => {
    try{
        let checkedWorks = req.body.attachThis
        if (typeof checkedWorks == 'string'){
            await Work.findByIdAndUpdate(checkedWorks, {$set: {attachedTo: req.params.promptid}})
            await Prompt.findByIdAndUpdate(req.params.promptid, {$inc: {worksNum: 1}})
        } else {
            await checkedWorks.forEach(work => {
                Work.findByIdAndUpdate(work, {$set: {attachedTo: req.params.promptid}}).exec()
             })
             await Prompt.findByIdAndUpdate(req.params.promptid, {$inc: {worksNum: checkedWorks.length}})
        }
       res.redirect(`/prompt/show/${req.params.promptid}`)
    }
    catch (err) { console.log(err)}
})
module.exports = router;