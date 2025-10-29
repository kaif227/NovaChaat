import express from "express";
import Thread from "../Models/Thread.js";
import getOpenAIAPIResponse from "../utils/openai.js";

const router = express.Router();



router.get("/thread", async (req, res) => {
  try {
    const threads = await Thread.find({}).sort({ createdAt: -1 }); 
    res.json(threads);
  } catch (error) {
    console.log("Error in /thread route:", error);
    res.status(500).json({ error: "Failed to fetch threads" });
  }
});

router.get("/thread/:threadId", async(req,res)=>{
    const {threadId}= req.params;
    try{
        let thread = await Thread.findOne({threadId});
        if(!thread){
            return res.status(404).json({error: "Thread not found"});
        }
        res.json(thread.messages);
    }catch(error){
        console.log("Error in /thread/:id route:", error);
        res.status(500).json({ error: "Failed to fetch the thread" });
    }
});


router.delete("/thread/:threadId", async(req,res)=>{
    const {threadId}= req.params;
    try{
        const deletedThread = await Thread.findOneAndDelete({threadId});
        if(!deletedThread){
            return res.status(404).json({error: "Thread not found"});
        }
        res.json({message: "Thread deleted successfully"});
    }catch(error){
        console.log("Error in DELETE /thread/:id route:", error);
        res.status(500).json({ error: "Failed to delete the thread" });
    }
});

router.post("/chat",async(req,res)=>{
    const {threadId, message} = req.body;
    if(!threadId || !message){
        return res.status(400).json({error: "threadId and message are required"});
    }

    try{
        let thread = await Thread.findOne({threadId});
        if(!thread){
            thread = new Thread({
                threadId,
                title:message,
                messages: [{role: "user", content: message}],
            });
        }
        else{
            thread.messages.push({role: "user", content: message});
        }

        const assistantReply = await getOpenAIAPIResponse(message);

        thread.messages.push({role: "assistant", content: assistantReply});
        thread.updatedAt = Date.now();

        await thread.save();
        
        res.json({reply:assistantReply});  


    }catch(error){
        console.log("Error in /chat route:", error);
        res.status(500).json({error: "Failed to process the chat message"});
    }
})
export default router;