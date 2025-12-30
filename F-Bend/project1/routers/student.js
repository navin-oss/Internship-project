const express = require("express")
const pool = require("../db/pool")
const result = require("../utils/result")
const CryptoJS = require("crypto-js")

const router = express.Router()

// get all courses (public) - Filter out past courses
router.get('/all-courses', (req, res) => {
  const sql = ` SELECT * FROM courses WHERE end_date >= CURDATE() `
  pool.query(sql, (error, data) => {
    res.send(result.createResult(error, data))
  })
})

// change password
router.put("/change-password", (req, res) => {
  const { email, newPassword, confirmpassword } = req.body;
  if (newPassword != confirmpassword) {
    return res.status(400).json({
      message: "New password and confirm password do not match"
    });
  }
  const sql = `UPDATE users SET password = ? WHERE email = ?`;
  const hashedPassword = CryptoJS.SHA256(newPassword).toString();

  pool.query(sql, [hashedPassword, email], (error, data) => {
    res.send(result.createResult(error, data))
  });
});

// get all registered courses of a student
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

//get all registered courseso of a student along  with valid videos
router.get("/my-course-videos", (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ message: "email is required" });
  }

  const sql = `
SELECT s.name, c.course_name, v.title, v.youtube_url, v.added_at
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