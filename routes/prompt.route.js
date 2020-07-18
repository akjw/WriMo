const Prompt = require('../models/prompt.model');
const User = require('../models/user.model');
const router = require('express').Router();
const isLoggedIn = require("../config/blockCheck");
const Work = require('../models/work.model');

router.get("/create", isLoggedIn, async (req, res) => {
    res.render("prompts/create");
})

router.post("/create", async (req, res) => {
    try {
        await Prompt.create({ name: req.body.name, description: req.body.description,  postedBy: req.user._id });
        res.redirect("/prompt");
    }
    catch(err) { console.log(err); }
})

router.get('/',  async (req, res) => {
    let prompts = await Prompt.find().populate("postedBy")
    res.render("prompts/index", { prompts })
})

router.get('/show/:id', isLoggedIn, async (req, res) => {
    try {
        let user = req.user
        let prompt = await Prompt.findById(req.params.id).populate('postedBy');
        let works = await Work.find().populate('postedBy').populate({path: 'attachedTo', match: {_id: req.params.id} });
        let promptWorks = works.filter(el => el.attachedTo != null);
        res.render("prompts/show", { prompt, user, promptWorks});
    }
    catch (err){ console.log(err);} 
})

router.get("/edit/:id", async (req, res) => {
    try {
        let prompt = await Prompt.findById(req.params.id);
        res.render("prompts/edit", {prompt});
    }
    catch (err) {console.log(err)}
})

router.post("/edit/:id", async (req, res) => {
    try {
        await Prompt.findByIdAndUpdate(req.params.id, req.body);
        res.redirect(`/prompt/show/${req.params.id}`);
    }
    catch (err) { console.log(err) }
})

router.delete("/delete/:id", (req, res) => {
    Prompt.findByIdAndDelete(req.params.id)
    .then(()=>{
        res.redirect("/prompt");
    })
    .catch(err => {
        console.log(err);
    })
})

module.exports = router;