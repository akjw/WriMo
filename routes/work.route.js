const Prompt = require('../models/prompt.model');
const Work = require('../models/work.model')
const User = require('../models/user.model');
const router = require('express').Router();
const isLoggedIn = require("../config/blockCheck");

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
        let work = await Work.findById(req.params.id).populate('postedBy');
        res.render("works/show", { work, user});
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
        await Prompt.findByIdAndUpdate(req.params.id, req.body);
        res.redirect("/works/show/:id");
    }
    catch (err) { console.log(err) }
})

router.delete("/delete/:id", (req, res) => {
    Work.findByIdAndDelete(req.params.id)
    .then(()=>{
        res.redirect("/prompt");
    })
    .catch(err => {
        console.log(err);
    })
})

module.exports = router;

