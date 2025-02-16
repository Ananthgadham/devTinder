const express = require('express');
const requestRouter = express.Router();
const {auth}=require("../middlewares/auth");
const {validateProfileUpdate}=require("../utils/validation");
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


module.exports = requestRouter;