const Prompt = require('../models/prompt.model');
const User = require('../models/user.model');
const router = require('express').Router();
const isLoggedIn = require("../config/blockCheck");
const Work = require('../models/work.model');
var query = null;

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

router.get('/all',  async (req, res) => {
    try {
        let numPerPage = 3;
        let currentPage = req.params.page || 1;
        // prompts to show on current page
        let prompts = await Prompt.find().populate('postedBy').skip((numPerPage * currentPage) - numPerPage).limit(numPerPage);
        let allRecords = await Prompt.countDocuments();
        res.render ("prompts/index", { query, prompts, currentPage, totalPages : Math.ceil(allRecords / numPerPage)})
        
    }
    catch (err) { console.log (err)}
})

router.get('/all/:page', async (req, res) => {
    try {
        var numPerPage = 3;
        var currentPage = req.params.page || 1;
        // works to show on current page
        let prompts = await Work.find().populate('postedBy').skip((numPerPage * currentPage) - numPerPage).limit(numPerPage);
        let allRecords = await Work.countDocuments();
        res.render ("prompts/index", { query, prompts, currentPage, totalPages : Math.ceil(allRecords / numPerPage)})
        
    }
    catch (err) { console.log (err)}
  });

// sort all prompts by search filters
router.get("/page/:page/search", async (req, res) => {
    try {
        query = req.query.filter;
        var numPerPage = 3;
        var currentPage = req.params.page;
        if (req.query.filter == 1){
            let prompts = await Prompt.find().populate("postedBy").sort({"worksNum":-1}).skip((numPerPage * currentPage) - numPerPage).limit(numPerPage);
            let allRecords = await Prompt.countDocuments();
            res.render("prompts/index", { query, prompts, currentPage, totalPages : Math.ceil(allRecords / numPerPage) });
        } else if (req.query.filter == 2) {
            let prompts = await Prompt.find().populate("postedBy").sort({"createdAt":-1}).skip((numPerPage * currentPage) - numPerPage).limit(numPerPage);
            let allRecords = await Work.countDocuments();
            res.render("prompts/index", { query, prompts, currentPage, totalPages : Math.ceil(allRecords / numPerPage) });
        }
       
    }
    catch(err) {console.log(err)}
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