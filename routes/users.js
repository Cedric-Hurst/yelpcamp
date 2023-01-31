const express = require('express');
const router = express.Router();
const users = require('../controllers/users');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');


router.route('/register')
    .get(users.registerPage)
    .post(catchAsync(users.createUser));
router.route('/login')
    .get(users.loginPage)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login);
router.get('/logout', users.logout);

module.exports = router;