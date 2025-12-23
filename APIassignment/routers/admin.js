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


//add new courses
router.post('/addCourse', (req, res) => {
  const { course_name,description,fees,start_date,end_date,video_expire_days} = req.body

  const sql = `INSERT INTO courses(course_name, description, fees, start_date, end_date, video_expire_days) VALUES (?, ?, ?, ?, ?, ?)`

  pool.query(
    sql,
    [course_name, description, fees, start_date, end_date, video_expire_days],
    (error, data) => {
      res.send(result.createResult(error, data))
    }
  )
})

//get all active courses
router.get('/all-active-courses', (req,res) => {
   const sql = ` SELECT * FROM courses WHERE start_date <= CURDATE()AND end_date >= CURDATE() `
  pool.query(sql, (error, data) => {
    res.send(result.createResult(error, data))
   })
})

//get all courses

router.get('/all-courses', (req, res) => {
  const { start_date, end_date } = req.query

  let sql = `SELECT * FROM courses`

  if (start_date && end_date) {
    sql += ` WHERE start_date >= '${start_date}' AND end_date <= '${end_date}'`
  }

  pool.query(sql, (error, data) => {
    res.send(result.createResult(error, data))
  })
})

//updatate a course by course_id
router.put("/update/:courseId", (req, res) => {
  const { courseId } = req.params
  const { course_name, description,fees, start_date, end_date,video_expire_days} = req.body

  const sql = ` UPDATE courses SET course_name = ?, description = ?, fees = ?,start_date = ?, end_date = ?, video_expire_days = ?
    WHERE course_id = ?`

  pool.query( sql, [course_name, description, fees, start_date, end_date, video_expire_days, courseId], (error, data) => {
      res.send(result.createResult(error, data))
    }
  )
})


//delete a course by course_id
router.delete("/delete/:courseId",(req, res) => {
  const { courseId } = req.params

  const sql = `DELETE FROM courses WHERE course_id = ?`

  pool.query(sql, [courseId], (error, data) => {
    res.send(result.createResult(error, data))
  })
})

// entrolled student based on course_id
router.get("/enrolled-students", (req, res) => {
  const { course_id } = req.query;

  if (!course_id) {
    return res.send(result.createResult("courseId is required", null));
  }

  const sql = `
    SELECT 
      s.reg_no,
      s.name,
      s.email,
      s.mobile_no,
      c.course_id,
      c.course_name
    FROM students s
    JOIN courses c ON s.course_id = c.course_id
    WHERE c.course_id = ?
    ORDER BY s.name
  `;

  pool.query(sql, [course_id], (err, data) => {
    res.send(result.createResult(err, data));
  });
});


module.exports = router;
 