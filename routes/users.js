const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync')
const passport = require('passport')
const users = require('../controllers/user')

router.route('/register')
    .get(users.renderRegisterPage)
    .post(wrapAsync(users.register))

router.route('/login')
    .get(users.renderLoginPage)
    .post(passport.authenticate(
        'local',
        {
            failureFlash: true,
            failureRedirect: '/login'
        }), users.loginUser)

router.get('/logout', users.logoutUser)
module.exports = router;