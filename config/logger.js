// Log Settings
var os = require("os");
module.exports = {
  console: {
    json: false,
    colorize: true
  },
  papertrail: {
    host: 'logs.papertrailapp.com',
    port: 37571, // your port here
    colorize: true,
    hostname: "nexus-" + os.hostname()
  },
  // file: {
  //   filename: 'app.log',
  //   // handleExceptions:true
  // }
};