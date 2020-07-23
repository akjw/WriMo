const Tag = require('../models/tag.model');
const router = require('express').Router();

router.get('/', async (req, res) => {
    try {
        let tags = await Tag.find();
        console.log(tags);
        res.render('tags/index', {tags})
    } 
    catch (err) {console.log(err)};
})

router.get('/create', (req, res) => {
    res.render('tags/new')
})

router.post('/create', async (req, res) => {
    try {
        await Tag.create({ name: req.body.name});
        res.redirect('/tag');
    }
    catch(err) { console.log(err); }
})

module.exports = router;