const Prompt = require('../models/prompt.model');
const Comment = require('../models/comment.model');
const Work = require('../models/work.model')
const User = require('../models/user.model');
const Tag = require('../models/tag.model');
const router = require('express').Router();
const isLoggedIn = require("../config/blockCheck");
var query = null;

router.get('/all',  async (req, res) => {
    try {
        let numPerPage = 3;
        let currentPage = req.params.page || 1;
        // works to show on current page
        let works = await Work.find().populate('tags').populate('postedBy').populate('attachedTo').skip((numPerPage * currentPage) - numPerPage).limit(numPerPage);
        let allRecords = await Work.countDocuments();
        res.render ("works/index", { query, works, currentPage, totalPages : Math.ceil(allRecords / numPerPage)})
        
    }
    catch (err) { console.log (err)}
})

router.get('/all/:page', async (req, res) => {
    try {
        var numPerPage = 3;
        var currentPage = req.params.page || 1;
        // works to show on current page
        let works = await Work.find().populate('tags').populate('postedBy').populate('attachedTo').skip((numPerPage * currentPage) - numPerPage).limit(numPerPage);
        let allRecords = await Work.countDocuments();
        res.render ("works/index", { query, works, currentPage, totalPages : Math.ceil(allRecords / numPerPage)})
        
    }
    catch (err) { console.log (err)}
  });

// sort all works by search filters
router.get("/page/:page/search", async (req, res) => {
    try {
        query = req.query.filter;
        var numPerPage = 3;
        var currentPage = req.params.page;
        if (req.query.filter == 1){
            let works = await Work.find().populate('tags').populate("postedBy").sort({"commentsNum":-1}).skip((numPerPage * currentPage) - numPerPage).limit(numPerPage);
            let allRecords = await Work.countDocuments();
            res.render("works/index", { query, works, currentPage, totalPages : Math.ceil(allRecords / numPerPage) });
        } else if (req.query.filter == 2) {
            let works = await Work.find().populate('tags').populate("postedBy").sort({"favesNum":-1}).skip((numPerPage * currentPage) - numPerPage).limit(numPerPage);
            let allRecords = await Work.countDocuments();
            res.render("works/index", { query, works, currentPage, totalPages : Math.ceil(allRecords / numPerPage) });
        }
        else if (req.query.filter == 3) {
            let works = await Work.find().populate('tags').populate("postedBy").sort({"createdAt":-1}).skip((numPerPage * currentPage) - numPerPage).limit(numPerPage);
            let allRecords = await Work.countDocuments();
            res.render("works/index", { query, works, currentPage, totalPages : Math.ceil(allRecords / numPerPage) });
        } 
       
    }
    catch(err) {console.log(err)}
})

router.get("/create", isLoggedIn, async (req, res) => {
    let prompt = null;
    let tags = await Tag.find();
    res.render("works/create", {prompt, tags});
})

router.post("/create", async (req, res) => {
    try {
        await Work.create({ title: req.body.title, summary: req.body.summary, body: req.body.body, tags: req.body.tags, postedBy: req.user._id});
        res.redirect("/user/dashboard");
    }
    catch(err) { console.log(err); }
})

router.get("/addto/:promptid", isLoggedIn, async (req, res) => {
    try {
        let prompt = await Prompt.findById(req.params.promptid)
        res.render("works/create", {prompt});
    }
    catch (err) {console.log(err)}
})

router.post("/addto/:promptid", async (req, res) => {
    try {
        let user = req.user
        await Work.create({ title: req.body.title, summary: req.body.summary, body: req.body.body, postedBy: req.user._id, attachedTo: req.params.promptid });
        await Prompt.findByIdAndUpdate(req.params.promptid, {$inc: {worksNum: 1}})
        res.redirect(`/prompt/show/${req.params.promptid}`);
    }
    catch(err) { console.log(err); }
})


router.get('/fave/:id', isLoggedIn, async (req, res) => {
    try {
        console.log('here')
    }
    catch (err){ console.log(err);} 
})

router.post('/fave/:id', isLoggedIn, async (req, res) => {
    try {
        let users = await User.find().populate({path: 'faveWorks', match: {_id: req.params.id}});
        let usersWhoFaved = users.filter(el => el.faveWorks.length !== 0);
        let hasFaved = usersWhoFaved.some(el => el._id == req.user.id)
        if (hasFaved){
            res.redirect(`/work/show/${req.params.id}`);
        } else {
            await User.findByIdAndUpdate(req.user._id, {$push: {faveWorks: req.params.id}})
            await Work.findByIdAndUpdate(req.params.id,  { $inc : {favesNum: 1}, $push: {favedBy: req.user._id}})
            res.redirect(`/work/show/${req.params.id}`);
        }
    }
    catch (err){ console.log(err);} 
})


router.get('/show/:id', async (req, res) => {
    try {
        let user = req.user || null
        let comments = await Comment.find().populate('postedBy').populate({path: 'onWork', match: {_id: req.params.id} })
        let workComments = comments.filter(el => el.onWork != null)
        let work = await Work.findById(req.params.id).populate('postedBy').populate('attachedTo').populate('tags');
        res.render("works/show", { work, user, workComments});
    }
    catch (err){ console.log(err);} 
})

router.get("/edit/:id", async (req, res) => {
    try {
        let work = await Work.findById(req.params.id).populate('tags');
        let isTaggedWith = work.tags.map(el => el._id)
        let tags = await Tag.find();
        res.render("works/edit", {work, tags, isTaggedWith});
    }
    catch (err) {console.log(err)}
})

router.post("/edit/:id", async (req, res) => {
    try {
        await Work.findByIdAndUpdate(req.params.id, req.body);
        res.redirect(`/work/show/${req.params.id}`);
    }
    catch (err) { console.log(err) }
})

router.delete("/delete/:id", async (req, res) => {
    try {
        let isAttached = await Work.findById(req.params.id).populate('attachedTo');
        console.log(isAttached.attachedTo);
        if(isAttached.attachedTo != null){
            await Prompt.findByIdAndUpdate(isAttached.attachedTo, { $inc : {worksNum: -1} });
        }
        await Work.findByIdAndDelete(req.params.id);
        res.redirect("/user/dashboard");
    }
    catch (err) {console.log(err)}
})

module.exports = router;

