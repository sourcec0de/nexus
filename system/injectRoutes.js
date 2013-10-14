/**
  * Injects dependencies into app
  * app.set, app.use
  **/

// Extend Array with unique function to ensure
// No duplicates are installed as middlware
Array.prototype.unique = function() {
  var a = this.concat();
  for (var i = 0; i < a.length; ++i) {
    for (var j = i + 1; j < a.length; ++j) {
      if (a[i] === a[j])
        a.splice(j--, 1);
    }
  }

  return a;
};

module.exports = function(app){
  var apis = app.apis;
  _.each(apis,function(version){
    var baseUri = version.config.baseUri;
    var globalPolicies = version.config.policies;

    _.each(version.config.resources,function(resource,name){

      var resUri = resource.uri;
      var resPolicies = resource.policies;

      _.each(resource.endpoints,function(endpoint,route){

        var endPath = baseUri+resUri;
        if(route != "/") endPath = endPath + route;
        // console.log(endPath);
        var controller = version.controllers[name][endpoint.controller];
        
        // Gather Policies to be installed
        var aggregatedPolicies = [].concat(globalPolicies)
                                   .concat(resPolicies)
                                   .concat(endpoint.policies)
                                   .unique();
        
        // Map policies to policy functions
        var policies = [];
        _.each(aggregatedPolicies,function(policy){
          policy = version.policies[policy];
          if(policy) policies.push(policy);
        })
        
        // Map all arguments for application route
        var routeArgs = [endPath].concat(policies);
        if(controller) routeArgs.push(controller);
        console.log(routeArgs);

        var appEnd = app[endpoint.method];
        appEnd.apply(app,routeArgs);
        // f.apply(f, ['hello', ' ', 'world'])
        // (controller)? app[endpoint.method](endPath,controller) : console.error("Missing controller");
      });

    });

  });
};