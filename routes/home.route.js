const router = require("express").Router();
const User = require('../models/user.model');
const Prompt = require("../models/prompt.model");
const Work = require("../models/work.model");
const isLoggedIn = require("../config/blockCheck");


router.get('/', async (req, res) => {
    try {
        res.render('home/index', {})
    } 
    catch (err) { console.log(err) }
})

module.exports = router;