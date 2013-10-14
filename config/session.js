// ====================================
// Adjust your session storage settings
// ====================================

// Generated with `openssl rand -base64 45` from shell
var default_secret = "yYvkivU2bc/VpY227qEE2Fko8bS5cozCyoHCAq0WX2vaxL/0iKmllXOrhX4p";

// Expose Session
module.exports = function(app, express) {
  var session = app.get("session");
  
  // Check for session config
  if (!session) return function(){};

  // require connect-mongo 
  var MongoStore = require('connect-mongo')(express);
  // Set the session store to a new MongoStore instance
  session.store = new MongoStore({
    collection: "sessions",
    auto_reconnect: true,
    mongoose_connection: __datastores.mongoose, // only works if you have enabled mongoose
    stringify: false
  }
  // onLoad session store callback 
  // , function(){console.log("Using mongoose as session store");}
  );

  app.use(express.cookieParser(session.secret))
  app.use(express.session(session));

};



// Example Mongoose connection for session store
// =============================================
// var MongoStore = require('connect-mongo')(express);
// app.use(express.cookieParser(session.secret))
// app.use(express.session({
//   store: new MongoStore({
//     collection: "sessions", // Collection (optional, default: sessions)
//     auto_reconnect: true, // This is passed directly to the MongoDB Server constructor as the auto_reconnect option (optional, default: false).
//     mongoose_connection: __mongoose.connections[0], // only works if you enabled mongoose as a datastore
//     stringify: false // If true, connect-mongo will serialize sessions using JSON.stringify before setting them, and deserialize them with JSON.parse when getting them. (optional, default: true). This is useful if you are using types that MongoDB doesn't support.
//   }),
//   secret: session.secret
// }));

// Example Redis connection for session store
// ==========================================
// var RedisStore = require('connect-redis')(express);
// app.use(express.cookieParser(session.secret))
// app.use(express.session({
//   store: new RedisStore({
//     db:'', // Database index to use
//     prefix:'sess:' // Key prefix defaulting to "sess:"
//     client: __datastores.redis // only works if you enabled redis as a datastore
//   }),
//   secret: session.secret
// }));

// Example Default Express session store - NOTE* Not for production use
// ====================================================================
// app.use(express.cookieParser(session.secret));
// app.use(express.session({
//   "secret": session.secret
// }));