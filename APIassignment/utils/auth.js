const jwt = require("jsonwebtoken")
const config = require("./config")
const result = require("./result")

function authUser(req, res, next) {
  const publicUrls = ["/signup","/login"]

  if (publicUrls.includes(req.url)) {
    return next()
  }

  const token = req.headers.token
  if (!token) {
    return res.send(result.createResult("Token is missing"))
  }

  try {
    const payload = jwt.verify(token, config.SECRET)
    req.headers.email = payload.email
    req.headers.role = payload.role   // ✅ fixed
    next()
  } catch {
    return res.send(result.createResult("Token is invalid"))
  }
}

function checkAuthorization(req, res, next) {
  if (req.headers.role === "admin") {
    return next()
  }
  return res.send(result.createResult("Unauthorized access"))
}

module.exports = { authUser, checkAuthorization }
