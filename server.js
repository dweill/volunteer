const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const passport = require('passport'), 
  FacebookStrategy = require('passport-facebook').Strategy;
  require('dotenv').config();

const app = express();

const mySecret = process.env.MY_SECRET;
const appId = process.env.FACEBOOK_APP_ID;
const appSecret = process.env.FACEBOOK_APP_SECRET;
const PORT = process.env.PORT;
// Middleware
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({ secret: mySecret }));
app.use(passport.initialize());
app.use(passport.session());

app.listen(PORT, function() {
  console.log(`listening on ${PORT}`);
});

passport.use(new FacebookStrategy({
  clientID: appId,
  clientSecret: appSecret,
  callbackURL: `http://localhost:${PORT}/auth/facebook/callback`,
},

  function(accessToken, refreshToken, profile, done) {
    User.findOrCreate({ 'facebook.id': profile.id }, function(err, user) {
      if (err) { return done(err); }
      done(null, user);
    });
  },
));

app.get('/auth/facebook', passport.authenticate('facebook'))
app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/',
                                      failureRedirect: '/login' }));
