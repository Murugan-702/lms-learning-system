import express from "express";
import mongoose from "mongoose";
import "dotenv/config"
import authRouter from "./router/authRouter.js"
const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string).then(()=>{
  console.log("Database connected successfully")
}).catch((error)=>{
  console.log(error)
})
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/auth",authRouter);

app.listen(7000,()=>{
    console.log("Server is running in port 7000")
})
