const express = require("express")
const pool = require("../db/pool")
const CryptoJS = require("crypto-js")
const jwt = require("jsonwebtoken")
const result = require("../utils/result")
const config = require("../utils/config")

const router = express.Router()



router.post('/register-to-course', (req, res) => {

  const { name, email, course_id, mobile_no } = req.body;

  const studentSql =
    `INSERT INTO students (name, email, course_id, mobile_no)
     VALUES (?, ?, ?, ?)`;

  pool.query(studentSql, [name, email, course_id, mobile_no], (err, result1) => {

    if (err) {
      return res.send(result.createResult(err, null));
    }

    const userSql =
      `INSERT INTO users (email) VALUES (?)`;

    pool.query(userSql, [email], (err2, result2) => {
      res.send(result.createResult(err2, {
        student: result1,
        user: result2
      }));
    });

  });
});




router.post("/login", (req, res) => {
  const { email, password } = req.body;
 const hashedPassword = CryptoJS.SHA256(password).toString();
 // 🔹 ADMIN LOGIN (HARDCODED)
  if (
    email === config.ADMIN_EMAIL &&
    password === config.ADMIN_PASSWORD
  ) {
    const payload = {
      email,
      role: "admin"
    };

    const token = jwt.sign(payload, config.SECRET);

    return res.send(
      result.createResult(null, {
        email,
        role: "admin",
        token
      })
    );
  }
  const sql = "SELECT * FROM users WHERE email = ? AND password=?";

  pool.query(sql, [email, hashedPassword], (error, data) => {
        if (error)
            res.send(result.createResult(error))
        else if (data.length == 0)
            res.send(result.createResult("Invalid email or password"))
        else {
            const user= data[0]
         
            const payload={
                email: user.email,
                role : user.role
            }
            const token=jwt.sign(payload,config.SECRET)
            const userData={
                email : user.email,
                role: user.role,
                token
            }
           
            res.send(result.createResult(null, userData))
        }
    })
})


module.exports = router