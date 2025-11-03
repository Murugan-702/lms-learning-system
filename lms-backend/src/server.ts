import express from "express";
import mongoose from "mongoose";
import cors from "cors";
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
console.log(process.env.FRONTEND_URL)
app.use(cors({
  origin: process.env.FRONTEND_URL as string || "",
  
}));

app.use("/api/auth",authRouter);

app.listen(7000,()=>{
    console.log("Server is running in port 7000")
})
