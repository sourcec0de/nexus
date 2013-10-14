// =======================================
// Global Configuration File
// 
// Contains Settings for all envs
// - staging
// - development
// - production
// - default
// - add custom?
// =======================================
var env = process.env
,   fs = require("fs")
,   path = require("path")
,   ssl_dir = path.join(__dirname,"ssl/")
;

// Export Settings
module.exports = {

  // ====================================
  // default Settings
  // ====================================
  "development": {
    "port": __argv.port || __env.PORT || 80,        // Default port for https access
    "trust proxy": __argv['trust-proxy'] || true,   // Enables reverse proxy support, disabled by default
    // "jsonp callback name": "callback",           // Changes the default callback name of ?callback=
    // "json replacer": null,                       // setting is a callback which is passed to JSON.stringify() in res.json() allowing you to manipulate and filter the 
    "json spaces": __argv['json-spaces'] || 2,      // JSON response spaces for formatting, defaults to 2 in development, 0 in production
    "case sensitive routing": false,                // Enable case sensitivity, disabled by default, treating "/Foo" and "/foo" as the same
    "strict routing": false,                        // Enable strict routing, by default "/foo" and "/foo/" are treated the same by the router
    "view cache": __argv['view-cache'] || false,    // Enables view template compilation caching, enabled in production by default
    "view engine": "jade",                          // The default engine extension to use when omitted
    "views": path.join(__root_path, "views"),   // The view directory path, defaulting to "./views"
    
    // Global Request timeout config
    "request_timeout":{ 
      "time": 10000,
      "throwError": true
    },


    // ============================================================================================
    // SSL SUPPORT
    // 
    // Comment this section out to disable SSL support
    // ============================================================================================
    // "ssl": {                            
    //   "port": __argv['ssl-port'] || __env.SSL_PORT || 443,      // default port for https access
    //   "certs": {
    //     "key": fs.readFileSync(ssl_dir + "server.key"),   // ssl cert key file
    //     "ca": fs.readFileSync(ssl_dir + "bundle.pem"),    // certificate authority chain
    //     "cert": fs.readFileSync(ssl_dir + "server.crt")   // ssl cert file
    //   }
    // },
    // ============================================================================================

    // =======================================================================
    // SESSION SUPPORT
    // Comment this section out to disable session support
    // =======================================================================
    "session": {
      "secret": "kis2m0U246i+SWK5iwNGS/Y2zwkiyrAAym6FC37KGFUXvKDd9398MIWfb1Bs",
      'key': 'sid',
      'proxy': true,
      "cookie": {
        "maxAge": (30 * 24 * 60 * 60 * 1000), // d   h   m   s   ms
        "signed": true,
        "secure": true
      }
    }
    // =======================================================================


  } // End of development settings

  
  
  // ADD PRODUCTION CONFIG
  // Inside production.js -> module.exports = {}
  // ===========================================
  // "production":require("./production.js"),

  // ADD STAGING CONFIG
  // ===========================================
  // "staging":require("./staging.js")


};


