const express = require("express")
const pool = require("../db/pool")
const CryptoJS = require("crypto-js");


const jwt=require("jsonwebtoken")
const result=require("../utils/result")
const config=require("../utils/config")


const router=express.Router()


router.post("/signup",(req,res)=>{
    const{email,password,role}=req.body
    const sql = `INSERT INTO users(email,password,role)VALUES(?,?,?)`
    const hashedPassword = CryptoJS.SHA256(password).toString();

    pool.query(sql,[email,hashedPassword,role],(error,data)=>{
        res.send(result.createResult(error,data))
    })

})

router.post("/login", (req, res) => {
  const { email, password } = req.body;
 const hashedPassword = CryptoJS.SHA256(password).toString();
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


module.exports = router;
 