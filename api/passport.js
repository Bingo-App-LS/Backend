const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const FacebookStrategy = require('passport-facebook');
const db = require('../models/users.js');


import {FACEBOOK_APP_ID, FACEBOOK_APP_SECRET, GOOGLE_APP_SECRET, GOOGLE_APP_ID} from "../.env"

passport.serializeUser((user,done)=> {
  done(null, user.id)
});

passport.deserializeUser((id, done) => {
  db.findUserByID(id).then((user)=> {
    done(null, user);
  })
})

passport.use(
  new GoogleStrategy({
  //options for the google strategy
  callbackURL: "/auth/google/redirect",
  clientID: GOOGLE_APP_ID,
  clientSecret: GOOGLE_APP_SECRET
}, (accessToken, refreshToken, profile, done) => {
// passport callback function
  db.findUserByID(profile.id).then((currentUser)=> {
    // already have the user
    if(currentUser) {
      done(null, currentUser);
      console.log('current user: ', currentUser)
    } else {
      // if not, create user in dbase
      db.add({
        username: profile.displayName,
        googleId: profile.id
      }).then((newUser) => {
        console.log('new user created: ', newUser)
        done(null, newUser);
      })

    }
  }) 
})
);


// Boiler plate code from passport docs dealing with the facebook strategy. 
// We need to setup facebook dev & link our app before we can get too dehumbleep into it



passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:5000/auth/facebook/callback",
    profileFields: ['id', 'email', 'picture.type(large)'],
    enableProof: true

  },
  async function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ facebookId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

app.get('/auth/facebook',
  passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });