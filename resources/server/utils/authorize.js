const { userStore } = require('./stores')

const authorize = (roles) => {
  return (req, res, next) => {
    const token = req.headers['authorization']
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' })
    }
    userStore.findOne({ _id: token }, (err, user) => {
      if (err) {
        return res.status(500).json({ message: 'Failed to get user from token' })
      }
      if (!user) {
        return res.status(401).json({ message: 'Unauthorized' })
      }
      if (!user.active) {
        return res.status(403).json({ message: 'Account activation required.' })
      }
      if (!roles.includes(user.role)) {
        return res.status(403).json({ message: 'Forbidden' })
      }
      req.user = user
      next()
    })
  }
}

module.exports = authorize
