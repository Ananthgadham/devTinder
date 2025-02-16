const express = require('express');
const requestRouter = express.Router();
const {auth}=require("../middlewares/auth");
const ConnectionRequest=require("../models/connectionRequest")
const User=require("../models/user");
requestRouter.post("/request/send/:status/:toUserId",auth,async(req,res)=>{
              try
              {
                      const fromUserId=req.user._id;
                      const toUserId=req.params.toUserId;
                      const status=req.params.status;

                    const allowedStatus=["intrest","accepted","ignore"];
                     if(!allowedStatus.includes(status))
                     {
                       return res.status(400).json({error:"Invalid Status "+status});
                     }


                     const UserId=await User.findById(toUserId);
                     if(!UserId)
                     {
                      return res.status(404).json({error:"User Not Found"});
                     }

                     const existingRequest=await ConnectionRequest.findOne({
                      $or: [
                        {fromUserId,toUserId},
                        {fromUserId:toUserId,toUserId:fromUserId}
                      ]});

                      if(existingRequest)
                      {
                        return res.status(400).json({error:"Request Already Sent"});
                      }

                      const connectionRequest=new ConnectionRequest({fromUserId,toUserId,status});
                      const data=await connectionRequest.save();
                      res.json({message:req.user.firstName+" sent request to "+UserId.firstName});
                      
              }
              catch(err)
              {
                res.status(400).send(err.message);
              }

})


requestRouter.post("/request/review/:status/:requestId",auth,async(req,res)=>{
    try
    {
      const {status,requestId}=req.params;
      const loggedInUser=req.user;
      const allowedStatus=["accepted","rejected"];
      if(!allowedStatus.includes(status))
      {
        return res.status(400).json({error:"Invalid Status "+status});
      }

     const connectionRequest=await ConnectionRequest.findOne({
      _id:requestId,
      toUserId:loggedInUser._id,
      status:"intrest"
     });

     if(!connectionRequest)
     {
      return res.status(404).json({error:"Request Not Found"});
     }

     connectionRequest.status=status;
     const data=await connectionRequest.save();
     res.json({message:req.user.firstName+" "+status+" request",data});

    }
    catch(err)
    {
      res.status(400).send(err.message);
    }
  });


module.exports = requestRouter;