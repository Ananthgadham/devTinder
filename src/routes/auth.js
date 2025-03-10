const express=require("express");
const authrouter=express.Router();
const User=require("../models/user");
const bcrypt=require("bcrypt");
const {validateSignUpData}=require("../utils/validation");

authrouter.post('/signup', async (req, res) => {
    try {
        validateSignUpData(req.body); // ✅ Fix: Pass `req.body`, not `req`
        const {firstName,lastName,email,phone,gender,password,profilePic}=req.body
        const Hash= await bcrypt.hash(password,10);
        const user = new User({firstName,lastName,email,password:Hash,phone,gender,profilePic});
        const saveduser=await user.save();
        const token=await saveduser.getJWT();
        res.cookie("token",token,{expires:new Date(Date.now()+1000*60*60*24)})
        res.json({ message: "User added successfully!", saveduser });
    } catch (err) {
        res.status(400).json({ error: err.message }); // ✅ Fix: Send only `err.message`
    }
});

authrouter.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        // ✅ Await the database query
        const findUser = await User.findOne({ email: email });
        if (!findUser) {
            return res.status(404).json({ error: "Invalid details" });
        }
        // ✅ Compare hashed password
        const isPasswordValid = await findUser.validatePassword(password);
        if (isPasswordValid) {
            const token=await findUser.getJWT();
            res.cookie("token",token,{httpOnly:true,expires:new Date(Date.now()+1000*60*60*24)});
            res.send(findUser);
        } else {
            return res.status(401).json({ error: "Invalid details" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message }); // ✅ Fix: Send only `err.message`
    }
});

authrouter.post("/logout",(req,res)=>{
    res.cookie("token"," ",{expires:new Date(Date.now())});
    res.send("Logged Out");
})




module.exports = authrouter;

