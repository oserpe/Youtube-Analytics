const { MongoClient } = require('mongodb');

let _db;

function connect(callback){
  MongoClient.connect(process.env.MONGODB_URI)
    .then(client => {
      console.log('Connected!');
      _db = client.db();
      callback();
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
  throw new Error('No database found!');
};

module.exports = {
    connect,
    getDB
}