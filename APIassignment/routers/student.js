const express = require("express")
const pool = require("../db/pool")
const result = require("../utils/result")

const router = express.Router()


///student/my-courses GET get all registered courses of a student
router.get('/my-courses', (req, res) => {
  const { email } = req.query;
   const sql = `SELECT *
    FROM students s
    JOIN courses c ON s.course_id = c.course_id
    WHERE s.email = ?
  `;

  pool.query(sql, [email], (error, data) => {
    res.send(result.createResult(error, data));
  })
});


//registers student to a course
router.post('/register-to-course',(req,res)=>{

    const {name, email, course_id, mobile_no} =req.body;
    const sql=`insert into students (name, email, course_id, mobile_no) values(?,?,?,?)`;
    pool.query(sql,[name, email, course_id, mobile_no],(error,data)=>{
         res.send(result.createResult(error, data))
    })
    
});

// change password

router.put("/change-password",(req,res) =>{
  const{email,newPassword,confirmpassword}= req.body;
 if(newPassword != confirmpassword)
{
    return res.status(400).json({
      message: "New password and confirm password do not match"
    });
}
const sql = `UPDATE users SET password = ? WHERE email = ?`;


pool.query(sql,[newPassword,email],(error,data)=>{
     res.send(result.createResult(error, data))
});
});



// my-course with videos
router.get("/my-course-videos", (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ message: "email is required" });
  }

  const sql = `
SELECT s.name, c.course_name, v.title, v.youtube_url
FROM students s
JOIN courses c ON s.course_id = c.course_id
JOIN videos v ON c.course_id = v.course_id
WHERE s.email = ?`;

pool.query(sql, [email], (error, data) => {
    if (error) {
      res.status(500).json(error);
    } else {
      res.json(data);
    }
  });
});






module.exports = router;