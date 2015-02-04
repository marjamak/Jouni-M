// malli täältä http://nodejs.org/
// ja täältä https://github.com/timole/mashup-tile/blob/master/program.js

var http = require('http');
var _ = require('lodash');
var statusHtml = "<html><body>No data available</body></html>";

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
  
	http.get("http://metadata.helmet-kirjasto.fi/search/author.json?query=Campbell", function(res) {
		console.log("Got response: " + res.statusCode);
		var body = '';
		res.on("data", function(chunk) {
		    body += chunk;
		});

		res.on("end", function() {
            var bookList = _.map(JSON.parse(body).records, function(d) {
                return {
                    displayName: d.title,
                    year: d.year
                };
            });
            console.log("Got list of books:", bookList);

            statusHtml = "<html><body>";
            _.map(bookList, function(d) {
                statusHtml += "<h1>" + d.displayName + "</h1>";
                statusHtml += "<p>" + d.year + "</p>";
            });

            statusHtml += "</body></html>";
        });
	
	}).on('error', function(e) {
	        console.log("Got error: " + e.message);
		});
		
	res.end(statusHtml);		
}).listen(1337, '127.0.0.1');
console.log('Hello, Server running at http://127.0.0.1:1337/');  
  
