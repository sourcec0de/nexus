// =====================
// NEXUS
// Module dependencies.
// =====================

// Load process arguments

// GLOBALS
async = require('async');
__env = process.env;
__argv = require('optimist').argv;
__NODE_ENV = __argv.en|| __env.NODE_ENV || "development";

_ = require('underscore');
__root_path = (__dirname);
__gapps = require("./config/gapps.js")[__NODE_ENV];
__datastores = {};

// Mods
var fs = require("fs")
,   os = require("os")
,   util = require('util')
,   path = require('path')
,   http = require('http')
,   https = require('https')
,   load = require('express-load')
,   balance = require('./system/balance.js')
,   reload = require('./system/reload.js')
,   middleware = require("./config/middleware.js")
,   express = require('express')
,   toobusy = require('toobusy')
;



// Display title art
if(!__argv["dis-art"]) console.log(fs.readFileSync('nexus.txt','utf8'));

// ====================
// Logging Dependencies
// ====================
var log_conf = require(__dirname + '/config/logger.js');
var winston = require('winston')
var expressWinston = require('express-winston')
var Papertrail = require('winston-papertrail').Papertrail

// WINSTON LOGGERS
var all_logging_transports = [];
var winstonConsole, winstonPapertrail, winstonFile;

// LOG TO CONSOLE
if(log_conf.console){
  winstonConsole = new winston.transports.Console(log_conf.console);
  all_logging_transports.push(winstonConsole);
};

// LOG TO PAPERTRAIL
if(log_conf.papertrail){
  winstonPapertrail = new Papertrail(log_conf.papertrail);
  all_logging_transports.push(winstonPapertrail);
};

// LOG TO FILE
if(log_conf.file){
  winstonFile  = new winston.transports.File(log_conf.file);
  all_logging_transports.push(winstonFile);
};

// CONFIGURE GLOBAL LOGGER
var logger = new (winston.Logger)({
  transports: all_logging_transports
  // exceptionHandlers: []
});

// OVERRIDE DEFAULT CONSOLE LOGGING METHODS with Async Winston Loggers
var formatArgs = function(args){return [util.format.apply(util.format, Array.prototype.slice.call(args))]};
console.log = function(){logger.info.apply(logger, formatArgs(arguments))};
console.info = function(){logger.info.apply(logger, formatArgs(arguments))};
console.warn = function(){logger.warn.apply(logger, formatArgs(arguments))};
console.error = function(){logger.error.apply(logger, formatArgs(arguments))};
console.debug = function(){logger.debug.apply(logger, formatArgs(arguments))};


// =================
// global env config
// =================

// Loads config file based on current environment
// Select a configuration that matches the env
var CONFIG = require(__dirname + "/config/config.js")[__NODE_ENV];
if(!CONFIG){
  console.error("Missing config for: "+__NODE_ENV);
  process.exit(1);
};

// ===================
// Enable App Settings
// ===================
function createApp(){
  // Disables default x-powered-by header
  var app = express();
  app.toobusy = toobusy
  // installs toobusy to 503 out of a request if the server
  // is under a heavy load, keeping your server from 'melting'
  // https://hacks.mozilla.org/2013/01/building-a-node-js-server-that-wont-melt-a-node-js-holiday-season-part-5/
  
  app.disable('x-powered-by');
  app.set('env', __NODE_ENV);
  app.set('port',                   CONFIG['port']           || 3000);
  app.set('ssl',                    CONFIG['ssl']            || false);
  app.set('session',                CONFIG['session']        || false);
  app.set('json spaces',            CONFIG['json spaces']    || 0);
  app.set('trust proxy',            CONFIG['trust proxy']    || true);
  app.set('strict routing',         CONFIG['strict routing'] || false);
  app.set('view cache',             CONFIG['view engine']    || false);
  app.set('view engine',            CONFIG['view engine']    || 'jade');
  app.set('views',                  CONFIG['views']          || path.join(__dirname, "app/views/"));
  app.set('json replacer',          CONFIG['json replacer']  || null);
  app.set('jsonp callback name',    CONFIG['jsonp callback name']    || "callback");
  app.set('case sensitive routing', CONFIG['case sensitive routing'] || false);
  app.set('request_timeout',        CONFIG['request_timeout']        || { throwError: true, time: 100000 });

  // =================
  // ENABLE MIDDLEWARE
  // =================

  middleware(app,express);
  // Bind static routes and blueprints
  app.use(app.router);
  // reload();

  // =======================
  // development only config
  // =======================

  // if ('development' == app.get('env')) {
  //   app.use(express.errorHandler());
  // }

  // ===============================
  // Handle Routing, middleware, etc
  // ===============================
  // TEST ROUTE

  load('apis/')
  .then('system/injectRoutes.js')
  .into(app);
  // console.log(app.routes)

  // app.all("*",function(req,res){
  //   // console.log(req.app)
  //   res.json({
  //     query: req.query || null,
  //     body:  req.body  || null,
  //     files: req.files || null
  //   });
  // });

  return app;

}
// ==============
// Launch Servers
// ==============
function start() {
  var app = createApp();
  console.log("Application Mode:", app.settings.env)
  var server = http.createServer(app); // Start HTTP
  // Initialize Listeners
  server.listen(app.get('port'), function() {
    var lp = this.address().port;
    console.log("HTTP server listening on port %d".green, lp);
  });
  // Handle connection errors
  server.on("error", function(e) {
    console.error(("HTTP_SERVER_ERROR - CHECK APP PERMISSIONS FOR PORT " + app.settings.port).red);
    console.error(e);
    process.exit(1);
  });

  // CHECK For SSL Support
  if (app.get('ssl')) {
    var ssl_server = https.createServer(app.get('ssl').certs, app); // Start HTTPS
    ssl_server.listen(app.get('ssl').port, function() {
      var lp = this.address().port;
      console.log("HTTPS server listening on port %d".green, lp);
    });
    ssl_server.on("error", function(e) {
      console.error(("HTTPS_SERVER_ERROR - CHECK APP PERMISSIONS FOR PORT " + app.get('ssl').port).red);
      console.error(e);
      process.exit(1);
    });
  }
}


if (module === require.main) {
  if (__argv.cluster) balance(start);
  else start();
}

// =====================================
// Export app to initialize testing hook
// =====================================
module.exports = createApp;
// module.exports = app;