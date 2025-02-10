const express = require('express');
const connectDB=require('./config/database');
const app=express();
const {auth,userauth}=require("./middlewares/auth");
const User=require('./models/user');
 app.use(express.json());
 app.post('/signup',async(req,res)=>{
    console.log(req.body);
    const user=new User(req.body);
   try{ 
    await user.save();
    res.send("user added");
   }
   catch(err){
    res.send(err);
   }
 });

app.get("/user",async (req,res)=>{
    const firstName=req.body.firstName;
    try
    {
        const users=await User.find({firstName});
        if(users.length==0)
        {
            res.status(404).send("no user found");
        }
        else
        {
        res.send(users);
        }
    }
   catch(err){
        res.status(400).send("something went wrong");
    }
});

app.get("/feed",async(req,res)=>{
    try{
        const users=await User.find({});
        res.send(users);
    }
    catch(err){
        res.status(400).send("something went wrong");
    }
}); 


app.delete("/deleteuser",async(req,res)=>{
    const id=req.body.id;
    try{
        const user=await User.findByIdAndDelete(id);
        res.send("user deleted");
    }
    catch(err){
        res.status(400).send("something went wrong");
    }
});



app.patch("/update",async(req,res)=>{
    const id=req.body.id;
    const data=req.body;
    try{
        const user=await User.findByIdAndUpdate(id,data);
        res.send("user updated");
    }
    catch(err){
        res.status(400).send("something went wrong");
    }
});



connectDB().then(()=>{
    console.log("connected to database");
    app.listen(3000,()=>{
        console.log('server is running on port 3000');
    });
}).catch((err)=>{
    console.log(err);
}
)

