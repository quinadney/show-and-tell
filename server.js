/*// server.js

// modules --------------------------------------
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

// configuration --------------------------------

// config files
var db = require('./config/db');

var port = process.env.PORT || 8080; // set our port
// mongoose.connect(db.url); // connect to our mongoDB database (uncomment after you enter your own credentials in config/db.js)

// get all data/stuff of the body (POST) parameters
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded

app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override reader in the request. simulate DELETE/PUT
app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users

// routes ----------------------------------------
require('./app/routes')(app); // configure our routes

// start app -------------------------------------
app.listen(port); // startup our app at http://localhost:8080
console.log('Magic happens on port ' + port); // shoutout to the user
exports = module.exports = app; // expose app
*/

'use strict';

var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
  app.listen(port);var request = require('request');
var queryString = require('query-string');

app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/public/views');
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    res.render('index');
});

app.get('/proxy', function(req, res) {
    var url = req.query.url;
    delete req.query.url;
    url += ('?' + queryString.stringify(req.query)) || '';
    console.log(url);
    console.log(req.query);
    var options = {
        url: url
    };
    console.log('Options:', options);

    request(options, function(error, response, body) {
        if (error) {
            console.log(error);
            res.send(error);
        } else {
            console.log(body);
            res.send(body);
        }
    });
});