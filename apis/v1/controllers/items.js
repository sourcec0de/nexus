module.exports.index = function(req,res,next){
  res.json(req.session)
}