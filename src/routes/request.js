const express = require('express');
const requestRouter = express.Router();
const {auth}=require("../middlewares/auth");
requestRouter.post("/sendconnection",auth,async(req,res)=>{
  const user=req.user;
  console.log("conncetion sending");
  res.send("conncetion sent by "+user.firstName);
})

module.exports = requestRouter;