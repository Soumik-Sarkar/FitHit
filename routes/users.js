const express = require('express')
const router = express.Router();
const passport = require('passport');
const users = require('../controllers/users');
const catchAsync = require('../utils/catchAsync');
const { alreadyLoggedIn } = require('../middleware')


router.get('/register',alreadyLoggedIn, users.renderRegister);

router.post('/register', catchAsync(users.register));

router.get('/login',alreadyLoggedIn, users.renderLogin)

router.post('/login',passport.authenticate('local',{failureFlash: true, failureRedirect:'/login'}), users.login)

router.get('/logout', users.logout)

module.exports = router;