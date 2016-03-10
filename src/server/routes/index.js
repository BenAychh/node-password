var express = require('express');
var router = express.Router();
var pg = require('pg');
var knex = require('../../../db/knex.js');
var passport = require('../lib/auth.js');
var helpers = require('../lib/helpers.js');
var bcrypt = require('bcrypt');
function Users() {
  return knex('users');
}

router.get('/', helpers.ensureAuthenticated, function(req, res, next) {
  console.log(req.flash());
  var email = '[Please Sign In]';
  if (req.user) {
    console.log(req.user);
    email = req.user.email;
  }
  res.render('index', { title: 'Welcome ' + email });
});
router.get('/login', helpers.loginRedirect, function(req, res, next) {
  res.render('login', {formAction: '/login'});
});

router.get('/logout', helpers.ensureAuthenticated, function(req, res, next) {
  req.logout();
  res.redirect('/');
});

router.post('/login', helpers.loginRedirect, function(req, res, next) {
  var message = req.flash('message');
  passport.authenticate('local', function(err, user) {
    if (err) {
      return next(err);
    } else {
      req.logIn(user, function(err) {
        if (err) {
          return next(err);
        }
        req.flash('message', {
          'status': 'success',
          'message': 'welcome'
        });
        return res.redirect('/');
      });
    }
  })(req, res, next);
});

router.get('/register', helpers.loginRedirect, function(req, res, next) {
  res.render('login', {formAction: '/register'});
});

router.post('/register', helpers.loginRedirect, function(req, res, next) {
  Users().where({email: req.body.email})
  .then(function(results) {
    if (results.length === 0) {
      helpers.hashPromise(req.body.password)
      .then(function(hash) {
        var insert = {
          email: req.body.email,
          password: hash
        };
        Users().insert(insert).then(function() {
          res.redirect('/login');
        });
      });
    } else {
      req.flash('message', 'Email already exists');
      res.redirect('/login');
    }
  });
});

module.exports = router;
