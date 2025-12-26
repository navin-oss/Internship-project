const jwt = require("jsonwebtoken")
const config = require("./config")
const result = require("./result")

function authUser(req, res, next) {
    // for ever incoming request this middleware will be called
    const allAllowedUrls = ['/admin/signin', '/admin/login']
    if (allAllowedUrls.includes(req.url))
        next()
    else {
        const token = req.headers.token
        if (!token)
            res.send(result.createResult('Token is missing'))
        else {
            try {
                const payload = jwt.verify(token, config.SECRET)
                //req.headers.payload = payload
              
                req.headers.email = payload.email
                req.headers.role = payload.role;
                //role la pn enter karane
                next()
                // authorization()
            } catch (ex) {
                res.send(result.createResult('Token is Invalid'))
            }
        }
    }
}
  const publicUrls = ["/signup","/login"]

  if (publicUrls.includes(req.url)) {
    return next()
  }

  const token = req.headers.token
  if (!token) {
    return res.send(result.createResult("Token is missing"))
  }


module.exports = authUser;
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
