const router = require("express").Router();
const User = require('../models/user.model');
const Prompt = require("../models/prompt.model");
module.exports = router;

router.get('/dashboard', async (req, res) => {
    try {
        let user = await User.findById(req.user._id);
        let userPrompts = await Prompt.find().populate({path: 'postedBy', match: {_id: req.user._id}})
        res.render('users/dashboard', {user, userPrompts})
    } 
    catch (err) { console.log(err) }
})