const express = require('express');
const router = express.Router();
const User = require('../models/UserModel')


router.get('/', function (req, res, next) {
    myError = req.session.err;
    req.session.err = undefined;

    res.render('login', {
        linkActive: 'login',
        user: req.session.user,
        err: myError,
    });

});

router.post('/', function (req, res, next) {
    (async () => {
        let user = await User.fetchByUsername(req.body.user);
        if (user.id === undefined || !user.checkPassword(req.body.password)){
            res.render('login', {
                linkActive: 'login',
                user: req.session.user,
                err: "Username or password incorrect.",
            });
            return;
        } 

        req.session.user = user;
        res.redirect('/');
    })();

});


module.exports = router;