/**
 * Globally Available Application Settings
 * __gapps
 *
 * These settings are for access anywhere in your application
 **/


// Example: access mongodb info 
// This will return variables
// based on the application env
// __gapps.datastores.mongodb

var global_application_settings = {
  // Add these for each env
  development: {
    // Connection info for all your datastores
    facebook: {
      appKey: "YOUR_FACEBOOK_APP_KEY",
      appSec: "YOUR_FACEBOOK_APP_SEC"
    },

    // Enable datastores by adding a line that
    // corresponds with the datastore file located under config/datastores/
    // example - config/datastore/mongoose.js
    datastores: {
      mongoose: "mongodb://localhost:27017/nexus",
      // redis:"redis://localhost:2000",
      // redis:   "redis://redistogo:2ff82e84b5708867835939c88f69c0d9@squawfish.redistogo.com:9430",
      // mongodb: "mongodb://root:myPassword@mongo.onmodulus.net:27017/3xam9l3",
      // postgres: {},
      // mysql: {},

      // If this is true the application will force quit
      // through process.exit(1) unclean on any connection errors
      exitOnConnectionError:true
    }
  }

};

module.exports = global_application_settings;