/**
  * Load all Middleware functions
  * All middlware here is loaded before app.router
  **/

// System definitions
var connectTimeout = require('connect-timeout')
,   redis = require("./datastores/redis.js")
,   mongoose = require("./datastores/mongoose.js")
,   expressValidator = require("express-validator")
,   session = require("./session.js")
,   cssPre  = require("./cssPre.js")
,   path = require('path')
;

// ============================
// Require your middleware here
// ============================

// var yourMiddleWare = require("yourMiddleware");


// Expose middleware loader
module.exports = function(app, express) {

  // Enable DataStores
  redis()    // enables __redis
  mongoose() // enables __mongoose

  // Init Express Middleware
  // The absolute first piece of middle-ware we would register, to block requests
  // before we spend any time on them.
  app.use(function(req, res, next) {
    // check if we're toobusy() - note, this call is extremely fast, and returns
    // state that is cached at a fixed interval
    if (req.app.toobusy()) res.send(503, "I'm busy right now, sorry.");
    else next();
  });

  app.use(express.logger(":date :remote-addr :referrer :method :url :status :response-time"));
  // app.use(function(req,res,next){
  //   console.log(
  //     new Date().toISOString(),
  //     req.ip,
  //     req._parsedUrl.href
  //   )
  //   next()
  // });
  app.use(express.favicon());
  
  // Enable Req Timeouts
  var timeout = connectTimeout(app.get("request_timeout"));
  app.use(timeout);
  
  // gzip responses
  app.use(express.compress());
  
  // Enable CSS Pre Processing
  // defaults to less
  // app.use(cssPre);
  

  // Enable Session Support
  session(app,express);

  // enable static resources
  // consider serving these from a CDN
  app.use(express.static(path.join(__root_path, 'public'),{
    maxAge:0,           // Browser cache maxAge in milliseconds. defaults to 0, oneDay = 86400000
    hidden:false,       // Allow transfer of hidden files. defaults to false
    redirect:true,      // Redirect to trailing "/" when the pathname is a dir. defaults to true
    index:'index.html'  // Default file name, defaults to 'index.html'
  }));
  

  // Parse JSON request bodies, providing the
  // parsed object as req.body.
  app.use(express.json({
    // strict:false // when false anything JSON.parse() accepts will be parsed
    // reviver: // used as the second "reviver" argument for JSON.parse
    // limit: // byte limit [1mb]
  }));

  // Parse x-ww-form-urlencoded request bodies,
  // providing the parsed object as req.body.
  app.use(express.urlencoded({
    // limit: // byte limit [1mb]
  }));

  // Add middleware to parse double encoded urls that may
  // contain JSON strings when ?qs_fmt=json is present
  // app.use(qsJsonParser)
  
  // Replace multipart with your own
  // file handling middleware
  app.use(express.multipart());

  // validation module
  app.use(expressValidator());

  // Make your api more strict by disabling
  // the ability to overide a req method ?_method=POST
  // app.use(express.methodOverride());
};