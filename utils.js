var MongoClient = require('mongodb').MongoClient;
	
function write_helmet_data_db(JSONdata) {
   // var MongoClient = require('mongodb').MongoClient;
    // Connect to the db
    MongoClient.connect("mongodb://localhost:27017/db", function(err, db) {
        if(!err) { console.log("We are connected for writing"); };
        if(err) { return console.dir(err); }
        var collection = db.collection('test');
        collection.insert({ _id: 10, data: JSONdata}, {w:1}, function(err, result) {});  
		console.log("Saved data in database.");
    });
};
  

function reset_db() {
 //   var MongoClient = require('mongodb').MongoClient;
    // Connect to the db
    MongoClient.connect("mongodb://localhost:27017/db", function(err, db) {
        if(!err) { console.log("We are connected for reseting"); };
        if(err) { return console.dir(err); }
        var collection = db.collection('test');
        collection.remove({_id: 10}, function(err, result){});
		console.log("Database cleared.");
    });   	
};
 exports.write_helmet_data_db = write_helmet_data_db;
 exports.reset_db = reset_db;