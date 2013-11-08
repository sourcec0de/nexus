/**
  * Injects dependencies into app
  * app.set, app.use
  **/


var traverse = require('traverse');
var should = require('should');


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



// Inject Object keys into
// scope of specified function
var upgradeScope = function(obj,fun){


};

// Expose
module.exports = function(app){
  var apis = app.apis;

  // traverse(apis).forEach(function(x){
  //   console.log(x)
  // })

  // Build APIs
  _.each(apis,function(version){
    var baseUri = version.config.baseUri;
    var globalPolicies = version.config.policies;

    // Build API versions
    _.each(version.config.resources,function(resource,name){

      var resUri = resource.uri;
      var resPolicies = resource.policies;

      // Build resources for API
      _.each(resource.endpoints,function(endpoint,route){

        // Construct routes
        var endPath = baseUri+resUri;
        if(route != "/") endPath = endPath + route;
        // console.log(endPath);

        var controller = version.controllers[name][endpoint.controller];
        var controllerValidator = function(req,res,next){
          var params = endpoint.params;
          for(var param in params){
            var validations = params[param];
            for(var v in validations){
              var vData = validations[v];
              console.log(param,v,vData)
              var validate = req.assert(param,vData.msg);
              // vData.args = Array(vData.args);
              validate[v].apply(validate,vData.args);
            }
          }
          var errors = req.validationErrors(true);
          if(errors) return res.json(errors);
          req.endpointParams = params;
          next()
        };

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
        var middleware = policies;
        if(controllerValidator) middleware.push(controllerValidator);
        if(controller) middleware.push(controller);
        console.log(middleware);

        app[endpoint.method](endPath,middleware);
        // var appEnd = app[endpoint.method];
        // appEnd.apply(app,routeArgs);
        
      });

    });

  });
};