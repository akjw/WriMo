const router = require('express').Router();

router.get('/', (req, res) => {
    console.log('in message')
    res.render('messages/index')
})

module.exports = function (app, io) {
    //Socket.IO
    io.on('connection', function (socket) {
        console.log('User has connected to Index');
        //ON Events
        socket.on('admin', function () {
            console.log('Successful Socket Test');
        });

        //End ON Events
    });
    return router;
};