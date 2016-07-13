var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

router.get('/', function(req, res) {
	mongoose.connect('mongodb://0.0.0.0/local');
  	res.send('boom');
});

module.exports = router;
