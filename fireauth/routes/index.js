var express = require('express');
var router = express.Router();
//var request = require('request');
var mongodb = require('mongodb');

// We need to work with "MongoClient" interface in order to connect to a mongodb server.
var MongoClient = mongodb.MongoClient;

// Connection URL. This is where your mongodb server is running.
var dbUrl = 'mongodb://localhost:27017/games';

// we will use this variable later to insert and retrieve a "collection" of data
var collection

// Use connect method to connect to the Server
MongoClient.connect(dbUrl, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
    // HURRAY!! We are connected. :)
    console.log('Connection established to', dbUrl);
    
    collection = db.collection('pokemon');
    /*collection.insert(pokemon, function (err, result) {
  if (err) {
    console.log(err);
  } else {
    console.log('Inserted documents into the "pokemon" collection. The documents inserted with "_id" are:', result);
  }
  
  // Dont Close connection
  // db.close()
});*/
  }
});

/* GET home page. */
router.get('/', function(req, res) {
  res.sendFile('index.html', { root: 'public' });
});

router.get('/games', function(req, res) {
  console.log("In Get Games");
  collection.find().toArray(function(err, result) {
    if(err) {
      console.log(err);
    } else if (result.length) {
      console.log("Query Worked");
      console.log(result);
      res.send(result);
    } else {
      console.log("No Documents found");
    }
  });
});

router.post('/games', function(req, res) {
    console.log("In Games Post");
    console.log(req.body);
    collection.insert(req.body, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log('Inserted documents into the "games" collection. The documents inserted with "_id" are:', result);
        res.end('{"success" : "Updated Successfully", "status" : 200}');
      }
    });
});

router.delete('/games', function(req, res, next) {
  console.log("Deleting");
  collection.remove(function(err) {
    if(err) return console.error(err);
    else {
      console.log("Deleted successfully");
      res.sendStatus(200);
    }
  });
});

module.exports = router;