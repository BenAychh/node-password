var passport = require('passport');
var LocalStrategy = require('passport-local');
var knex = require('../../../db/knex.js');
var helpers = require('./helpers.js');
function Users() {
  return knex('users');
}
passport.use(new LocalStrategy( {
  usernameField: 'email',
  },
  function(email, password, done) {
    knex('users').where({email: email}).select()
    .then(function(results) {
      if(results.length !== 0) {
        helpers.checkPassword(password, results[0].password)
        .then(function() {
          console.log(results);
          return done(null, results[0]);

        })
        .catch(function(err) {
          return done(err);
        });
      } else {
        return done(null, false, { message: 'Incorrect username.'});
      }
    })
    .catch(function(err) {
      return done(err);
    });
  }
));

passport.serializeUser(function(user, done) {
  console.log('trying to serialize ' + user);
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  Users().where({id: id}).select().
  then(function(results) {
    if (results.length !== 0) {
      done(null, results[0]);
    } else {
      done(null, false);
    }
  });
});

module.exports = passport;
