var express = require('express');
var router = express.Router();
var flickrAPI = require('../api/flickrapi');
var passport = require('passport'); 
LocalStrategy = require('passport-local').Strategy;


passport.use('local-login', new LocalStrategy(
    function (username, password, done) {
        console.log('local-login-stragegy', username, password);

        if (username === password) {
            console.log('done...right');
            return done(null, {username: username});
        } else {
            console.log('done...');
            return done(null, false, {message: 'Incorrect account'});
        }
    }));

passport.serializeUser(function(user, done) {
    console.log('serializeUser', user);
    done(null, user.username);
});

passport.deserializeUser(function(username, done) {
    console.log('deserializeUser', username);
    done(null, username);
  // User.findById(id, function(err, user) {
  //   done(err, user);
  // });
});

// As with any middleware it is quintessential to call next()
// if the user is authenticated
var isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}



router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/flickr', 
    failureRedirect: '/', 
    failureFlash: false
}));


/* GET home page. */
router.get('/', function (req, res) {
    console.log('get /');
    res.render('index', { title: 'Express', data: 'lorem ipsum'});
});


//https://api.flickr.com/services/rest/?method=flickr.tags.getRelated&api_key=1759a0fc58d02e5485b2e4b2387511d0&tag=sunset&format=json&nojsoncallback=1
router.get('/flickr', isAuthenticated, function (req, res) {
    console.log('session', req.session);
    var f = new flickrAPI();
    f.tags.getRelated('sunset').then(function(data) {
        res.json(data);
    });
});

module.exports = router;
