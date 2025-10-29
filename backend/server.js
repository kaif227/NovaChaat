import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import chatRouter from './Routes/Chat.js';

const app = express();
const PORT = 8080;



app.use(express.json());
const allowedOrigin = [
  "https://novachat-dd7q.onrender.com",
  "http://localhost:5173"
]
app.use(cors({
  origin: function(origin, callback){
  if(!origin || allowedOrigin.includes(origin)){
    callback(null, true)

  }else{
  callback(new Error("Not allowed by CORS"))
}},
methods: ["GET", "POST","PUT","DELETE"],
credentials: true
}))



app.use('/api', chatRouter);

main()
.then(
 console.log("Connected to MongoDB")
).catch(err => console.log(err));
async function main() {
  await mongoose.connect(process.env.MONGODB_URL);
}


app.listen(PORT, () =>{
    console.log(`Server is running on ${PORT}`);
    
})