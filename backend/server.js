import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import chatRouter from './routes/Chat.js';

const app = express();
const PORT = 8080;



app.use(express.json());

app.use(cors({
  origin: [
    "https://nova-backend-2tbn.onrender.com"
  ],
  methods: ["GET", "POST"],
  credentials: true
}));

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