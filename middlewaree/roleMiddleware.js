const jwt = require('jsonwebtoken')
const { secret } = require('../config');

module.exports = function (roles) {
  return function (req, res, next) {
    if (req.method === 'options') {
      next()
    }
    try {
      const token = req.headers.authorization.split(' ')[1]
      if (!token) {
        return res.status(403).json({ message: "User not logged in" })
      }
      const { roles: userRoles } = jwt.verify(token, secret)
      let hasRole = false
      userRoles.forEach(role => {
        if (roles.includes(role)) {
          hasRole = true
        }
      });
      if (!hasRole) {
        return res.status(403).json({ message: "Dont have permissions" })
      }
      next();
    }
    catch (e) {
      console.error(e, "error middleware")
      return res.status(403).json({ message: "User not logged in" })
    }
  }
}