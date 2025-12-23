const express = require("express");
const pool = require("../db/pool");
const result = require("../utils/result");
const adminAuth = require("../utils/auth");
const router=express.Router();


//get all active courses

// router.get('/all-active-courses', (req,res) => {
//    const sql = ` SELECT * FROM courses WHERE start_date <= CURDATE()AND end_date >= CURDATE() `
//   pool.query(sql, (error, data) => {
//     res.send(result.createResult(error, data))
//    })
// })

//get all courses

// router.get('/all-courses', (req, res) => {
//   const { start_date, end_date } = req.query

//   let sql = `SELECT * FROM courses`

//   if (start_date && end_date) {
//     sql += ` WHERE start_date >= '${start_date}' AND end_date <= '${end_date}'`
//   }

//   pool.query(sql, (error, data) => {
//     res.send(result.createResult(error, data))
//   })
// })


//add new courses
// router.post('/addCourse', (req, res) => {
//   const { course_name,description,fees,start_date,end_date,video_expire_days} = req.body

//   const sql = `INSERT INTO courses(course_name, description, fees, start_date, end_date, video_expire_days) VALUES (?, ?, ?, ?, ?, ?)`

//   pool.query(
//     sql,
//     [course_name, description, fees, start_date, end_date, video_expire_days],
//     (error, data) => {
//       res.send(result.createResult(error, data))
//     }
//   )
// })


//updatate a course by course_id
// router.put("/update/:courseId", (req, res) => {
//   const { courseId } = req.params
//   const { course_name, description,fees, start_date, end_date,video_expire_days} = req.body

//   const sql = ` UPDATE courses SET course_name = ?, description = ?, fees = ?,start_date = ?, end_date = ?, video_expire_days = ?
//     WHERE course_id = ?`

//   pool.query( sql, [course_name, description, fees, start_date, end_date, video_expire_days, courseId], (error, data) => {
//       res.send(result.createResult(error, data))
//     }
//   )
// })

//delete a course by course_id
// router.delete("/delete/:courseId", (req, res) => {
//   const { courseId } = req.params

//   const sql = `DELETE FROM courses WHERE course_id = ?`

//   pool.query(sql, [courseId], (error, data) => {
//     res.send(result.createResult(error, data))
//   })
// })


//toget all videos
router.get("/all-videos", adminAuth, (req, res) => {
  const { courseId } = req.query;

  let sql = "SELECT * FROM videos";
  let params = [];

  if (courseId) {
    sql += " WHERE course_id=?";
    params.push(courseId);
  }

  pool.query(sql, params, (err, data) => {
    res.send(result.createResult(err, data));
  });
});

//add video
router.post("/add", adminAuth, (req, res) => {
  const { courseId, title,  description, youtubeURL} = req.body;

  const sql = `
    INSERT INTO videos(course_id,title,description,youtube_url,added_at)
    VALUES (?,?,?,?,CURDATE())
  `;

  pool.query(
    sql,
    [courseId, title, description, youtubeURL],
    (err, data) => res.send(result.createResult(err, data))
  );
});


//update video
router.put("/update/:videoId", adminAuth, (req, res) => {
  const { videoId } = req.params;
  const { courseId, title, youtubeURL, description } = req.body;

  const sql = `
    UPDATE videos 
    SET course_id=?, title=?, youtube_url=?, description=?
    WHERE video_id=?
  `;

  pool.query(
    sql,
    [courseId, title, youtubeURL, description, videoId],
    (err, data) => res.send(result.createResult(err, data))
  );
});


//delete video
router.delete("/delete/:videoId", adminAuth, (req, res) => {
  const { videoId } = req.params;

  pool.query(
    "DELETE FROM videos WHERE video_id=?",
    [videoId],
    (err, data) => res.send(result.createResult(err, data))
  );
});

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
    //console.log ("registration");
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

//student put
//new password,change password
router.put("/change-password", (req, res) => {
    const { email, newPassword, confirmPassword } = req.body

    if (newPassword !== confirmPassword) {
        res.send(result.createResult("Password not matching", null))
        return
    }
  });
});



module.exports = router;
