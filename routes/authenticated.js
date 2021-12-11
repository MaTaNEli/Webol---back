
exports.checkAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next()
    }
  
    res.status(200).json('need to send him back to login page')
}
  
exports.checkNotAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return res.status(200).json('he is ok to post')
    }
    next()
}
