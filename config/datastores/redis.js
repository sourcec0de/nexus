var redis = require('redis')
,   url = require('url')
;

// Expose Redis client
module.exports = function() {

  var config = __gapps.datastores.redis;
  var exitOnConnectionError = __gapps.datastores.exitOnConnectionError;

  // Check if redis is enabled
  if(!config) return function(){};

  // check for redis env
  if (typeof config === 'string') {
    try {
      var redis_connection = url.parse(config);
      config = {
        host: redis_connection.hostname,
        port: redis_connection.port,
        auth: redis_connection.auth,
        debug: false
      };
    }
    catch(e) {
      // error pulling redis_togo params
      console.log('Error pulling redis params', config, e);
    }
  }

  redis.debug_mode = config.debug;

  var client = redis.createClient(config.port, config.host);
  if (config.auth) {
    var auth = (config.auth.indexOf(":") > 0) ? config.auth.split(":")[1] : config.auth;
    client.auth(auth);
  }
  
  // Attach redis to global namespace
  if (config.db) client.select(config.db);
  __datastores.redis = client;

  // Watch Redis Connection for events
  client.on("ready", function() {
    console.log("Redis connection successful: redis://"+config.host+":"+config.port);
  });

  client.on("error", function() {
    console.error("Redis failed connection to: redis://"+config.host+":"+config.port);
    
    // Exit if connection failed
    if(exitOnConnectionError) process.exit(1);
  });

};