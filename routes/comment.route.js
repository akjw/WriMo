const Prompt = require('../models/prompt.model');
const Comment = require('../models/comment.model');
const User = require('../models/user.model');
const router = require('express').Router();
const isLoggedIn = require("../config/blockCheck");
const Work = require('../models/work.model');

router.get("/addto/:workid", isLoggedIn, async (req, res) => {
    let user = req.user
    res.render("comments/create", {user});
})

router.post("/addto/:workid", isLoggedIn, async (req, res) => {
    try {
        await Comment.create({ name: req.user.username, body: req.body.body, onWork: req.params.workid, postedBy: req.user._id });
        await Work.findByIdAndUpdate(req.params.workid, {$inc: {commentsNum: 1}})
        res.redirect(`/work/show/${req.params.workid}`);
    }
    catch(err) { console.log(err); }
})

router.get('/on/:workid/showall', async (req, res) => {
    try {
        let work = await Work.findById(req.params.workid);
        let comments = await Comment.find().populate('postedBy').populate({path: 'onWork', match: {_id: req.params.workid} });
        let workComments = comments.filter(el => el.onWork != null);
        res.render("works/show", { work, workComments});
    }
    catch (err){ console.log(err);} 
})

router.get("/on/:workid/edit/:commentid", async (req, res) => {
    try {
        let user = req.user
        let work = await (await Work.findById(req.params.workid)).populate('postedBy');
        let thisComment = await Comment.findById(req.params.commentid);
        let comments = await Comment.find().populate('postedBy').populate({path: 'onWork', match: {_id: req.params.id} })
        let workComments = comments.filter(el => el.onWork != null)
        res.render("works/show", {user, work, thisComment, workComments});
    }
    catch (err) {console.log(err)}
})

router.post("/on/:workid/edit/:commentid", async (req, res) => {
    try {
        await Comment.findByIdAndUpdate(req.params.commentid, req.body);
        res.redirect(`/work/show/${req.params.workid}`);
    }
    catch (err) { console.log(err) }
})

router.delete("/on/:workid/delete/:id", async (req, res) => {
    try {
        await Prompt.findByIdAndUpdate(req.params.workid, { $inc : {commentsNum: -1} });
        await Comment.findByIdAndDelete(req.params.id)
        res.redirect(`/work/show/${req.params.workid}`);
    }
    catch (err) { console.log(err)}
})

module.exports = router;