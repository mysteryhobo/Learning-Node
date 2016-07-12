var querystring = require("querystring");
	fs = require("fs");
	formidable = require("formidable");
var zlib = require('zlib');



function start(response) {
	console.log("Request handler 'start' was called.");

	var body = '<html>'+
		'<head>'+
		'<meta http-equiv="Content-Type" '+
		'content="text/html; charset=UTF-8" />'+
		'</head>'+
		'<body>'+
		'<form action="/upload" enctype="multipart/form-data" '+
		'method="post">'+
		'<input type="file" name="upload">'+
		'<input type="submit" value="Upload file" />'+
		'</form>'+
		'</body>'+
		'</html>';

	response.writeHead(200, {"Content-Type": "text/html"});
	response.write(body);
	response.end();
}

function upload(response, request) {
	console.log("Request handler 'upload' was called.");

	var form = new formidable.IncomingForm();
	console.log("about to parse");
	form.parse(request, function (error, fields, files) {
		console.log("parsing done");

		fs.rename(files.upload.path, "/tmp/test.png", function(error) {
			if (error) {
				fs.unlink("/tmp/test.png", callback);
				fs.rename(files.upload.path, "/tmp/test.png");
			}
		});

		response.writeHead(200, {"Content-Type": "text/plain"});
		response.write("received image: <br/>");
		response.write("<img src='/show' />");
		response.end();
	});
}

function show(response) {
	console.log("Request handler 'show' was called");
	response.writeHead(200, {"Content-Type": "image/png"});
	fs.createReadStream("/tmp/test.png").pipe(response);
}

function helloWorld (response) {
	console.log("Request handler 'helloWorld' was called");
	response.writeHead(200, {"Content-Type": "text/plain"});
	response.write("Hello World!");
	response.end();
}

function buffers(response) {
	console.log("Request handler 'buffers' was called");
	var buf1 = new Buffer([10,20,30,40]);
	var text1 = "";
	for (var i = 0; i < 4; i ++) {
		text1 += buf1[i];
	}
	console.log(buf1);

	var text = "text getting sent to the buffer";
	var buf2 = new Buffer(text.length);
	buf2.write(text);

	var buf3 = new Buffer(text);
	var text2 = "this is new text";
	buf3.write(text2);
	var json = buf3.toJSON();

	response.writeHead(200, {"Content-Type": "text/plain"});
	response.write("Text 1: " + text1 + 
		"\nText 2: " + buf2.toString("utf8", 0 , text.length) + 
		"\nText 3: " + buf3.toString("utf8", 0, text2.length) + 
		"\nText 3 conc 2: " + Buffer.concat([buf3, buf2]) +
		"\nText 4: " + json);
	response.end();
}

//transfer text from one file to another
function streams(response) {
	//read from input.txt
	var data = "";

	// var readerStream = fs.createReadStream('input.txt');
	// readerStream.setEncoding("utf8");
	// readerStream.on('data', function(chunk) {
	// 	console.log("getting more data: " + chunk);
	// 	data += chunk;
	// });

	// readerStream.on('end', function() {
	// 	console.log("read complete: " + data);

	// 	//write data to file
	// 	var writerStream = fs.createWriteStream("output.txt");
	// 	writerStream.write(data, "utf8");
	// 	writerStream.end();

	// 	writerStream.on('finish', function() {
	// 		console.log("write complete");
	// 	});


	// 	response.writeHead(200, {"Content-Type": "text/plain"});
	// 	response.write(data);
	// 	response.end();
	// });

	// readerStream.on('error', function(err) {
	// 	console.log(err.stack);
	// });
	

	fs.createReadStream('input.txt')
	.pipe(zlib.createGzip())
	.pipe(fs.createWriteStream('input.txt.gz'));

	fs.createReadStream('input.txt.gz')
	.pipe(zlib.createGunzip())
	.pipe(fs.createWriteStream('input.txt'));

	console.log("program ended");
}

function stats (response) {
	console.log("Request handler 'stats' was called");
	fs.stat('input.txt', function(err, stats) {
		if (err) console.log(err.stack);
		console.log(stats);

		console.log("is File: " + stats.isFile());
		console.log("is dir: " + stats.isDirectory());
	})
}

function fileio(response) {
	console.log("Request handler 'fileio' was pressed");
	var buf = new Buffer(1024);

	fs.open('input.txt', 'r+', function(err, fd) {
		if (err) console.log(err.stack);
		console.log("file has been opened");
		fs.read(fd, buf, 0, buf.length, 0, function(err, bytes) {
			if (err) console.log(err.stack);
			console.log("bytes read: " + bytes);

			fs.writeFile('input.txt', buf.slice(0, bytes).toString(), function(err) {
				if (err) console.log(err.stack);
				console.log("writing to file");
			})

			response.writeHead(200, {"Content-Type": "text/plain"});
			response.write(buf.slice(0, bytes).toString());
			response.end();
			fs.close(fd, function(err) {
				if (err) console.log(err.stack);
			})
		});
	});
}

function globalObjects(response) {
	console.log("Request handler 'globalObjects' was pressed");
	console.log(__filename);
	console.log(__dirname);

	response.writeHead(200, {"Content-Type": "text/plain"});
	response.write(__filename + "\n" + __dirname + "\n" + process);
	response.end();
	setTimeout(printHello, 2000);
	var timer2 = setTimeout(printHello, 4000);
	clearTimeout(timer2);
}

function interval(response) {
	setInterval(printHello, 2000);
}

function printHello() {
	console.log("Hello World");
}

exports.start = start;
exports.upload = upload;
exports.show = show;
exports.helloWorld = helloWorld;
exports.buffers = buffers;
exports.streams = streams;
exports.stats = stats;
exports.fileio = fileio;
exports.globalObjects = globalObjects;
exports.interval = interval;