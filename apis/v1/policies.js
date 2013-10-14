exports.cors = function(req,res,next){
  console.log("cors enabled")
  next()
}

exports.authorized = function(req,res,next){
  console.log("Called to be authorized")
  next()
}