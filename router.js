var http = require('http');
var _ = require('lodash');
var db_utils = require("./utils");

function route(pathname, response) {
    console.log("....");
    console.log("About to route a request for " + pathname);
    if (pathname == "/api/query/books") {
	    get_data(response);  
	}	   
    else if (pathname == "/resetdb") {
        console.log("Routing to: reset_db");
		db_utils.reset_db();
        response.write("<p> <a href='/'>Paluu</a> </p>");
        response.end();
    } else {
        console.log("Routing to: print_guide");
		printDefaultPage(response);
    }
} 

function get_data(res) {
//query data first from database, if it fails then from internet
    var MongoClient = require('mongodb').MongoClient;
    // Connect to the db
    MongoClient.connect("mongodb://localhost:27017/db", function(err, db) {
        if(!err) { console.log("We are connected for reading"); };
        if(err) { return console.dir(err); }
        var collection = db.collection('test');
        collection.findOne({ _id: 10}, function(err, item) {
			if (item == null) { 
			    console.log ("Data not found in database"); 
				get_data_from_helmet(res)
			}
			else {
			    console.log ("Data found in database")
 	            res.writeHead(200, {"Content-Type": "text/plain; charset=utf-8"});
			    res.write(item.data);
			    res.end();
			    returnvalue = true;
			};
		});
	});   
}

var campbell = [];
var myJSON = "";
function get_data_from_helmet(res) {
	console.log("Get data from internet");
	http.get("http://metadata.helmet-kirjasto.fi/search/author.json?query=Campbell", function(helmet_res) {
	    console.log("Got response: " + helmet_res.statusCode);
		var body = '';
		helmet_res.on("data", function(chunk) {
		    body += chunk;
		});
		helmet_res.on("end", function() {
            var bookList = _.map(JSON.parse(body).records, function(d) {
                var item = {
                    "library_id": d.library_id,
                    "title": d.title,
		            "year": d.year
                };
                campbell.push(item);
            });
			myJSON = JSON.stringify({campbell: campbell}, null, 4);  
			console.log("Got list of books:");
	        res.writeHead(200, {"Content-Type": "text/plain; charset=utf-8"});
			res.write(myJSON);
			res.end();

			// save data into database
			db_utils.write_helmet_data_db(myJSON);
		});
	//	console.log(statusHtml);
	}).on('error', function(e) {
	    console.log("Got error: " + e.message);
	});
}

function printDefaultPage(response){
        response.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
	    response.write("<br>");
        response.write("<p>Käyttäjän tulee siirtyä <a href='/api/query/books'>kirjat-sivulle</a>, jotta </p>");
	    response.write("<p>Back-end hakee kirjalistan Helsingin kirjaston tietokannasta ja tulostaa sen JSON-muodossa:</p>");
	    response.write("<p>yksilöllinen tunnus (id), otsikko (title) ja vuosi (year).</p>");
	    response.write("<br>");
	    response.write("<p>Back-end tallentaa listan myös lokaaliin MongoDB-tietokantaan.</p>");
        response.write("<p>Kun pyyntö tehdään seuraavan kerran, tieto tulee lokaalista kannasta.</p>");
	    response.write("<br>");
        response.write("<p>Tyhjennä MongoDB-tietokanta <a href='/resetdb'>tästä.</a> </p>");
        response.end();
};

exports.route = route;
