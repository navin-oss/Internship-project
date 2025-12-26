const express = require("express")
const pool = require("../db/pool")
const CryptoJS = require("crypto-js")
const jwt = require("jsonwebtoken")
const result = require("../utils/result")
const config = require("../utils/config")

const router = express.Router()

router.post("/signup", (req, res) => {
  const { email, password, role } = req.body
  const hashed = CryptoJS.SHA256(password).toString()

  pool.query(
    "INSERT INTO users(email,password,role) VALUES (?,?,?)",
    [email, hashed, role],
    (err, data) => res.send(result.createResult(err, data))
  )
})

router.post("/login", (req, res) => {
  const { email, password } = req.body
  const hashed = CryptoJS.SHA256(password).toString()

  pool.query(
    "SELECT * FROM users WHERE email=? AND password=?",
    [email, hashed],
    (err, data) => {
      if (!data || data.length === 0)
        return res.send(result.createResult("Invalid credentials"))

      const payload = { email: data[0].email, role: data[0].role }
      const token = jwt.sign(payload, config.SECRET)

      res.send(result.createResult(null, { ...payload, token }))
    }
  )
})

module.exports = router
