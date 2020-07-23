const Prompt = require('../models/prompt.model');
const Work = require('../models/work.model')
const Tag = require('../models/tag.model');
const isLoggedIn = require("../config/blockCheck");
const router = require('express').Router();

router.get('/', async (req, res) => {
    try {
        let tags = await Tag.find();
        console.log(tags);
        res.render('tags/index', {tags})
    } 
    catch (err) {console.log(err)};
})

router.get('/show/:id', async (req, res) => {
    try {
        let tag = await Tag.findById(req.params.id);
        let works = await Work.find({tags:{$in: [req.params.id]}}).populate('tags').populate('postedBy').populate('attachedTo');
        console.log('works', works)
        let prompts = await Prompt.find({tags:{$in: [req.params.id]}}).populate('tags').populate('postedBy');
        res.render('tags/show', {works, prompts, tag})
    } 
    catch (err) {console.log(err)};
})

router.get('/create', isLoggedIn, (req, res) => {
    res.render('tags/new')
})

router.post('/create', isLoggedIn, async (req, res) => {
    try {
        await Tag.create({ name: req.body.name});
        res.redirect('/tag');
    }
    catch(err) { console.log(err); }
})

module.exports = router;