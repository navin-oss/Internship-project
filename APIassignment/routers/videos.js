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

module.exports = router;
