import  express  from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv'
import cors from "cors";
import authRouter from "./route/auth.js";
import router from "./route/post.js";

dotenv.config()
const app=express();


// midleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(cors())

// routes
app.use("/",authRouter)
app.use("/",router)



app.get('/', (req, res) => res.send("let's started..."));

const PORT=process.env.PORT||3000


// connect mongo db atlas
mongoose.connect(process.env.MONGO_URL,{usenewurlparser:true,}).then(()=>{
    console.log("connected to mongodb atlas")
}).catch(error=>{
console.log("something wrong")
})


// server port
app.listen(PORT,()=>{
    console.log("server started at port http://localhost:3000");
})