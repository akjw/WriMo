const Prompt = require('../models/prompt.model');
const Comment = require('../models/comment.model');
const Work = require('../models/work.model')
const User = require('../models/user.model');
const router = require('express').Router();
const isLoggedIn = require("../config/blockCheck");




router.get('/',  async (req, res) => {
    try {
        //landing page
        let works = await Work.find().populate("postedBy").populate("attachedTo");
        res.render("works/index", { works});
    }
    catch(err) {console.log(err)}
   
})

// sort all works by search filters
router.get("/filter", async (req, res) => {
    try {
        if (req.query.filter == 1){
            let works = await Work.find().populate("postedBy").sort({"commentsNum":-1});
            res.render("works/index", { works });
        } else if (req.query.filter == 2) {
            let works = await Prompt.find().populate("postedBy").sort({"createdAt":-1});
            res.render("works/index", { works });
        }
       
    }
    catch(err) {console.log(err)}
})

router.get("/create", isLoggedIn, async (req, res) => {
    let prompt = null;
    res.render("works/create", {prompt});
})

router.post("/create", async (req, res) => {
    try {
        await Work.create({ title: req.body.title, summary: req.body.summary, body: req.body.body, postedBy: req.user._id});
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

// router.get('/', async (req, res) => {
//     let works = await Work.find().populate("postedBy")
//     res.render("works/index", { works })
// })

router.get('/show/:id', isLoggedIn, async (req, res) => {
    try {
        let user = req.user
        let allPrompts = req.allP;
        let comments = await Comment.find().populate('postedBy').populate({path: 'onWork', match: {_id: req.params.id} })
        let workComments = comments.filter(el => el.onWork != null)
        let work = await Work.findById(req.params.id).populate('postedBy').populate('attachedTo');
        res.render("works/show", { allPrompts, work, user, workComments});
    }
    catch (err){ console.log(err);} 
})

router.get("/edit/:id", async (req, res) => {
    try {
        let work = await Work.findById(req.params.id);
        res.render("works/edit", {work});
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
        let isAttached = await Work.findById.populate('attachedTo');
        console.log(isAttached.attachedTo);
        if(isAttached.attachedTo != null){
            await Prompt.findByIdAndUpdate(isAttached.attachedTo, { $inc : {worksNum: -1} });
        }
        await Work.findByIdAndDelete(req.params.id);
        res.redirect("/prompt");
    }
    catch (err) {console.log(err)}
})

module.exports = router;

