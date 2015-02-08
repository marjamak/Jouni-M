// http://www.nodebeginner.org/#event-driven-callbacks

// to interpret the request object, we need some additional Node.js modules, namely url and querystring. 
// The url module provides methods which allow us to extract the different parts of a URL (like e.g. 
// the requested path and query string), and querystring can in turn be used to parse the query string 
// for request parameters

var http = require("http");
var url = require("url");
var router = require("./router");

function start(route) {
  function onRequest(request, response) {
    var pathname = url.parse(request.url).pathname;
    console.log("Request for " + pathname + " received.");
    route(pathname, response);
  }
  http.createServer(onRequest).listen(8888);
  console.log("Server has started.");
}

start(router.route);


