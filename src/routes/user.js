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
        }).populate("fromUserId","firstName lastName profilePic").populate("toUserId","firstName lastName profilePic");
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



userRouter.get("/user/feed",auth,async(req,res)=>{
    try {  
              const loggedInUser=req.user;
              const page=parseInt(req.query.page);
              let limit=parseInt(req.query.limit);
              limit=limit>50?50:limit;
              const skip=(page-1)*limit;
              const connectionRequests=await ConnectionRequest.find({
                $or:[
                    {
                        fromUserId:loggedInUser._id
                    },
                    {
                        toUserId:loggedInUser._id
                    }
                    ]
              }).select("fromUserId toUserId");



          const hideUsersFromFeed=new Set();
          connectionRequests.forEach((req)=>
          {
           hideUsersFromFeed.add(req.fromUserId.toString());
           hideUsersFromFeed.add(req.toUserId.toString());
          }
        );
        console.log(hideUsersFromFeed);



        const users=await User.find({
            $and:[
            {_id:{$nin:Array.from(hideUsersFromFeed)}},
            {_id:{$ne:loggedInUser._id}},
            ],
        }).
        select("firstName lastName profilePic").skip(skip).limit(limit);




        res.send(users);
       }  
    catch(err){
        res.status(400).json({error:err.message});
    }
})



module.exports = userRouter;