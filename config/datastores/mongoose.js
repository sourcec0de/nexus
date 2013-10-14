var mongoose = require('mongoose');

module.exports = function() {
  // only connect once
  if (mongoose.connection.readyState !== 0) return;
  var connectionString = __gapps.datastores.mongoose;
  var exitOnConnectionError = __gapps.datastores.exitOnConnectionError;
  // Check for mongoose connection string
  if (!connectionString) return function(){};
  var mongoOptions = {
    db: {
      // Ensure safe writes
      safe: true,
      native_parser: true
    }
    // server: {
    //   poolSize: 5
    // },
    // replset: {
    //   rs_name: 'myReplicaSetName'
    // },
    // user: 'myUserName',
    // pass: 'myPassword'
  };


  var connection = mongoose.createConnection(connectionString, mongoOptions);

  // Handle Open Connection
  connection.on('open', function() {
    console.log('Mongoose connection successful: ' + connectionString);
  });

  // Handle Connection Errors
  connection.on('error', function(err) {
    console.error('Mongoose failed connection to: ' + connectionString);
    console.error(err)

    // Exit if connection failed
    if (exitOnConnectionError) process.exit(1);
  });

  __datastores.mongoose = connection;

};