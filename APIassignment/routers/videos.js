const express = require("express");
const pool = require("../db/pool");
const result = require("../utils/result");
const adminAuth = require("../utils/auth");

const router = express.Router();

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
  const { courseId, title, youtubeURL, description } = req.body;

  const sql = `
    INSERT INTO videos(course_id,title,youtube_url,description,added_at)
    VALUES (?,?,?,?,CURDATE())
  `;

  pool.query(
    sql,
    [courseId, title, youtubeURL, description],
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

//student API
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

//student put
//new password,change password
router.put("/change-password", (req, res) => {
    const { email, newPassword, confirmPassword } = req.body

    if (newPassword !== confirmPassword) {
        res.send(result.createResult("Password not matching", null))
        return
    }
    

    const sql = `UPDATE users SET password=? WHERE email=?`
    pool.query(sql, [newPassword, email], (error, data) => {
        res.send(result.createResult(error, data))
    })
})
// // my-course with videos
// router.get("/my-course-videos", (req, res) => {
//   const { email } = req.query;

//   if (!email) {
//     return res.status(400).json({ message: "email is required" });
//   }

//   const sql = `
// SELECT s.name, c.course_name, v.title, v.youtube_url
// FROM students s
// JOIN courses c ON s.course_id = c.course_id
// JOIN videos v ON c.course_id = v.course_id
// WHERE s.email = ?`;


//   pool.query(sql, [email], (error, data) => {
//     if (error) {
//       res.status(500).json(error);
//     } else {
//       res.json(data);
//     }
//   });
// });

module.exports = router;
