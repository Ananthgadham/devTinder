const express = require('express');
const requestRouter = express.Router();
const {auth}=require("../middlewares/auth");
const {validateProfileUpdate}=require("../utils/validation");
const bcrypt=require("bcrypt");
requestRouter.get("/profile/view",auth,async (req,res)=>{  
   try
   {         
     const user =req.user;
     res.send(user);
    }
    catch(err) {
        res.status(400).send(err.message);
    }
});

requestRouter.patch("/profile/update", auth, async (req, res) => {
    try {
        if (!validateProfileUpdate(req)) {
            return res.status(400).send({ error: "Invalid update request" });
        }

        const loggedInUser = req.user; // ✅ Fixed variable name
        console.log(loggedInUser);

        // ✅ Updating only allowed fields
        Object.keys(req.body).forEach((key) => {
            loggedInUser[key] = req.body[key];
        });

        await loggedInUser.save(); // ✅ Save changes to DB
        res.status(200).send({ message: "Profile updated successfully", user: loggedInUser }); // ✅ Send response

    } catch (err) {
        res.status(500).send({ error: err.message }); // ✅ Use 500 for internal server errors
    }
});










// ✅ Secure Password Update API
requestRouter.patch("/profile/password", auth, async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        // ✅ Ensure both old and new passwords are provided
        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: "Both old and new passwords are required" });
        }

        // ✅ Get the logged-in user
        const user = req.user; // `auth` middleware attaches user to req

        // ✅ Verify the old password
        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Old password is incorrect" });
        }

        // ✅ Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // ✅ Update the password
        user.password = hashedPassword;
        await user.save();
        console.log(user);
        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



module.exports = requestRouter;