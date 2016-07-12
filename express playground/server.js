// var http = require("http");
// var url = require("url");

// function start (route, handle) {
// 	function onRequest(request, response) {
// 		var pathname = url.parse(request.url).pathname;
// 		console.log("PathName: " + pathname);
// 		route(handle, pathname, response, request);
// 	}
	
// 	http.createServer(onRequest).listen(8888);
// 	console.log("Server has Started");
// }

// exports.start = start;









var express = require("express");
var app = express();
var fs = require("fs");

var user = {
	"user4" : {
		"name" : "peter",
		"password" : "1234",
		"profession" : "teacher",
		"id" : 4
	}
}

app.use(express.static('public'));

app.get('/', function(request, response) { 
	response.send("Hello World");
});

app.get('/index.html', function(request, response) {
	response.sendFile(__dirname + "/" + "index.html");
});

app.get('/process_get', function(request, response) {
	res = {
		first_name:request.query.first_name,
		last_name:request.query.last_name
	};
	console.log(res);
	response.end(JSON.stringify(res));
});

app.get('/listUsers', function(req, res) {
	fs.readFile(__dirname + "/" + "users.json", "utf8", function(err, data) {
		console.log(data);
		res.end(data);
	})
});

// app.get('/adduser', function(req, res) {
// 	fs.readFile(__dirname + '/' + 'users.json', 'utf8', function(err, data) {
// 		data = JSON.parse(data);
// 		data['user4'] = user['user4'];
// 		console.log(data);
// 		res.end(JSON.stringify(data));
// 	});
// });


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
		// data['user' + response.id] = response;
		data['user5'] = response;
		console.log(data);
		// res.end(JSON.stringify(data));
	});
	console.log(response);
	res.end(JSON.stringify(response));
});






var server = app.listen(8081, function() {
	var host = server.address().address;
	var port = server.address().port;
	console.log("listening at http://%s:%s", host, port);
});

