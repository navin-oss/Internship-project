const express = require("express")
const userRouter = require("./routers/admin")
const videoRouter = require("./routers/videos")
const studentRouter=require("./routers/student")
const authUser = require("./utils/auth")



const app=express()


app.use(express.json())
app.use("/admin",userRouter)
app.use(authUser)
app.use("/videos", videoRouter);
app.use("/student",studentRouter)


app.listen(4000,()=>{
    console.log("Server running at port 4000 ")
})