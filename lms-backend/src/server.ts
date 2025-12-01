import express from "express";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import cors from "cors";
import "dotenv/config"
import "./models/courses.js";
import "./models/chapter.js";
import "./models/lesson.js";
import authRouter from "./router/authRouter.js"
import courseRouter from "./router/courseRouter.js"
import uploadRouter from "./router/uploadRouter.js"
import chapterRouter from "./router/chapterRouter.js"
import lessonRouter from "./router/lessonRouter.js"
const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string).then(()=>{
  console.log("Database connected successfully")
}).catch(()=>{
  console.log("Unexpected Error Occurs");
})


app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use(cors({
  origin: process.env.FRONTEND_URL as string || "",
  
}));

app.use("/api/auth", authRouter);
app.use("/api/courses", courseRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/chapter", chapterRouter)
app.use("/api/lesson",lessonRouter)




app.listen(7000,()=>{
    console.log("Server is running in port 7000")
})
