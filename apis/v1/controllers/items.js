module.exports.index = function(req,res,next){
  res.json(req.endpointParams)
}

module.exports.show = function(req,res,next){
  res.json(req.endpointParams)
}