const isLoggedIn = (req, res, next) => {
  if (req.user === undefined || req.user.id !== Number(req.params.userId)) {
    const error = new Error('illegal action')
    error.status = 401
    return next(error)
  }
  next()
}

module.exports = isLoggedIn
