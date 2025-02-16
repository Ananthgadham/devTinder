const  express = require('express');
const userRouter = express.Router();
const {auth}=require("../middlewares/auth");
const User=require("../models/user");
const ConnectionRequest=require("../models/connectionRequest");

userRouter.get("/user/request/received",auth,async(req,res)=>{
    try{
        const loggedInUser = req.user;
          const receivedRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status:"intrest",
          }).populate("fromUserId","firstName lastName");

          res.json({message:"received requests",data:receivedRequests});
    }
    catch(err){
        res.status(400).json({error:err.message});
    }
});


userRouter.get("/user/connections",auth,async(req,res)=>{
    try
    {
        const loggedInUser=req.user;
        const connections=await ConnectionRequest.find({
           $or:[
            {
                fromUserId:loggedInUser._id,
                status:"accepted"
            },
            {
                toUserId:loggedInUser._id,
                status:"accepted"
            }
           ],
        }).populate("fromUserId","firstName lastName").populate("toUserId","firstName lastName");
        const data=connections.map((row)=>{
            if(row.fromUserId._id.equals(loggedInUser._id))
            {
                return row.toUserId;
            }
            else{
                return row.fromUserId;
            }
        })
        res.json({message:"connections",data});
    }
    catch(err)
          {
             res.status(400).json({error:err.message});
          }
});


module.exports = userRouter;