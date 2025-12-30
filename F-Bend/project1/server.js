const express = require("express")
const cors = require("cors")

const authRouter = require("./routers/auth")
const adminRouter = require("./routers/admin")
const studentRouter = require("./routers/student")
const videoRouter = require("./routers/videos")
const { authUser } = require("./utils/auth")

const app = express()

// ✅ ADD THESE TWO LINES (MOST IMPORTANT)
app.use(cors())
app.use(express.json())

// public routes
app.use("/auth", authRouter)

// protected routes
// app.use(authUser)
app.use("/admin", authUser, adminRouter)
app.use("/student", studentRouter)
app.use("/videos", authUser, videoRouter)

app.listen(4000, () => {
  console.log("Server running at port 4000")
})
