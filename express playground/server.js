var express = require("express");
var app = express();
var fs = require("fs");
var MongoClient = require('mongodb').MongoClient;


var user = {
	"user4" : {
		"name" : "peter",
		"password" : "1234",
		"profession" : "teacher",
		"id" : 4
	}
}

app.use(express.static('public'));

//directory
app.get('/', function(request, response) { 
	response.sendFile(__dirname + '/index.html');
});


//listing users
app.get('/listUsers', function(req, res) {
	fs.readFile(__dirname + "/" + "users.json", "utf8", function(err, data) {
		console.log(data);
		res.end(data);
	})
});

//addng users
app.get('/addUser', function(req, res) {
	res.sendFile(__dirname + '/' + "addUser.html");
});


app.get('/user_post', function(req, res) {
	response = {
		name:req.query.name,
		password:req.query.password,
		profesion:req.query.profession,
		id:req.query.id
	};
	fs.readFile(__dirname + '/' + 'users.json', 'utf8', function(err, data) {
		data = JSON.parse(data);
		console.log("balls" + JSON.stringify(data));
		data['user' + response.id] = response;
		console.log("\nballs2" + JSON.stringify(data));

		fs.writeFile(__dirname + '/' + "users.json", JSON.stringify(data), function(err) {
			if (err) console.log(err.stack);
			console.log("Success Writing to JSON File");
			res.writeHead(302, {'location': '/listUsers'});
			res.end();
		})
		console.log(data);
	});
	console.log(response);
});


//deleting users
app.get('/deleteUser', function(req, res) {
	res.sendFile(__dirname + '/deleteUser.html');
});

app.get('/user_delete', function(req, res) {
	fs.readFile(__dirname + '/users.json', 'utf8', function(err, data) {
		val = req.query.value;
		console.log("value: " + val);
		data = JSON.parse(data);
		console.log("Data: " + data);
		delete data['user' +  val];
		fs.writeFile(__dirname + '/users.json', JSON.stringify(data), function (err, data) {
			if (err) {
				console.log(err.stack);
				// res.end("error writing to file");
			}
			res.sendFile(__dirname + '/users.json');
		});

		console.log("Data: " + data);
	});
});

//view user
app.get('/:id', function(req, res) {
	fs.readFile(__dirname + '/users.json', 'utf8', function(err, data) {
		users = JSON.parse(data);
		var user = users['user' + req.params.id];
		console.log(user);
		res.end(JSON.stringify(user));
	});
});


app.get('/server', function(req, res) {
	mongoClient.connect("mongodb://localhost:27017/local", function(err, db) {
		if (err) console.log(err.stack);
		console.log("boom bam");
	})
})

var server = app.listen(8081, function() {
	var host = server.address().address;
	var port = server.address().port;
	console.log("listening at http://%s%s", host, port);
});

