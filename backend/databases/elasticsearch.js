const { Client } = require("@elastic/elasticsearch")

let _db;

function connect(callback) {
	_db = new Client({ node: process.env.ELASTIC_SEARCH_URI });
	console.log("ElasticSearch: Connected!");
	return callback();
}

function getDB() {
    if (_db) {
      return _db;
    }
    throw new Error("ElasticSearch: No database found!");
  };

module.exports = {
    connect,
    getDB
}