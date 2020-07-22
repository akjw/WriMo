const router = require("express").Router();
const User = require('../models/user.model');
const Prompt = require("../models/prompt.model");
const Work = require("../models/work.model");
const isLoggedIn = require("../config/blockCheck");


router.get('/', async (req, res) => {
    try {
        //To return _id of a random work
        let randomWork = await Work.aggregate([{ $sample: { size: 1 } }])
        let randomWorkId = randomWork[0]._id;
        res.render('home/index', {randomWorkId})
    } 
    catch (err) { console.log(err) }
})

module.exports = router;