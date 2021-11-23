const { Client } = require("@elastic/elasticsearch")

let _db;

function connect(callback) {
	_db = new Client({ node: process.env.ELASTIC_SEARCH_URI });
	console.log("Connected to ElasticSearch");
	callback();
}

function getDB() {
    if (_db) {
      return _db;
    }
    throw new Error('No database found!');
  };

module.exports = {
    connect,
    getDB
}