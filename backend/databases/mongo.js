const { MongoClient } = require("mongodb");

let _db;
let _client;

function connect(callback){
  return MongoClient.connect(process.env.MONGODB_URI)
    .then(client => {
      console.log("MongoDB: Connected!");
      _client = client;
      _db = client.db();
      return callback();
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
};

function getDB() {
  if (_db) {
    return _db;
  }
  throw new Error("MongoDB: No database found!");
};

async function closeConnection() {
  if(_client) {
    await _client.close();
    return;
  }
  throw new Error("MongoDB: No connection was found!");
}

module.exports = {
    connect,
    getDB,
    closeConnection
}