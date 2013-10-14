var cluster = require('cluster');
var os = require('os');

module.exports = function balance(init, max) {
  return cluster.isMaster? initMaster() : init();
};

function initMaster() {
  console.log("Control process running: PID=" + process.pid);

  cluster.on('exit', function(worker,code) {
    if (code != 0) {
      console.error("Worker crashed! Spawning a replacement.");
      cluster.fork();
    }
  });

  cluster.on('death', function(worker) {
    cluster.fork();
  });

  var workerCount =  (typeof __argv.cluster === "number")? __argv.cluster : os.cpus().length;
  var i = workerCount;
  var x = workerCount;
  var forkedCount = 0;
  while(i--) {
    console.log("Forking Process",forkedCount++,"/",x);
    cluster.fork();
  }

  // I'm using the SIGUSR2 signal to listen for reload requests
  // you could, instead, use file watcher logic, or anything else
  if (__argv['graceful-reload']) {
    process.on("SIGUSR2", function() {
      console.log("SIGUSR2 received, reloading workers");

      // delete the cached module, so we can reload the app
      delete require.cache[require.resolve("../app.js")];

      // only reload one worker at a time
      // otherwise, we'll have a time when no request handlers are running
      var i = 0;
      var workers = Object.keys(cluster.workers);
      var f = function() {
        if (i == workers.length) return;

        console.log("Killing " + workers[i]);

        cluster.workers[workers[i]].disconnect();
        cluster.workers[workers[i]].on("disconnect", function() {
          console.log("Shutdown complete");
        });
        var newWorker = cluster.fork();
        newWorker.on("listening", function() {
          console.log("Replacement worker online.");
          i++;
          f();
        });
      }
      f();
    });
  }


}