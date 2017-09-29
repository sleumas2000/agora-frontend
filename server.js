'use strict';

var express    = require('express');
var bodyParser = require('body-parser');
var morgan     = require('morgan');

var app = express();
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.json({limit: '50mb'}));

var PORT = process.env.PORT || 24672;

app.use(express.static(__dirname+'/www/'));

app.listen(PORT);
console.log('Serving thm juicy webpages on localhost:'+PORT);
