const MongoClient = require('mongodb').MongoClient;
var _connection = null;
var client;

const url =
  'mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false';
client = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

var open = function () {
  // Use connect method to connect to the Cluster
  client.connect(function (err) {
    console.log('Connected successfully to mongodb!');
  });
};

function get(dbName) {
  // Use to connect to specific DB in the Cluster
  const db = client.db(dbName);
  _connection = db;
  return _connection;
}

module.exports = {
  open: open,
  get: get,
};
