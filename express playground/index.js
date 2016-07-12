var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var handle = {}
handle["/"] = requestHandlers.start;
handle["/start"] = requestHandlers.start;
handle["/upload"] = requestHandlers.upload;
handle["/show"] = requestHandlers.show;
handle["/helloWorld"] = requestHandlers.helloWorld;
handle["/buffers"] = requestHandlers.buffers;
handle["/streams"] = requestHandlers.streams;
handle["/stats"] = requestHandlers.stats;
handle["/fileio"] = requestHandlers.fileio;
handle["/globalObjects"] = requestHandlers.globalObjects;
handle["/interval"] = requestHandlers.interval;

server.start(router.route, handle);