const express = require('express');
const connectDB = require('./config/database');
const { validateSignUpData } = require('./utils/validation');
const User = require('./models/user');
const bcrypt=require('bcrypt');
const cookieParser=require("cookie-parser");
const jwt=require("jsonwebtoken");
const {auth}=require("./middlewares/auth");
const app = express();
app.use(express.json());
app.use(cookieParser())


app.use("/",require("./routes/profile"));

app.use("/",require("./routes/request"));

app.use("/",require("./routes/auth"));









// 🔹 GET USER BY FIRST NAME (Fixed `req.query`)
// app.get("/user", async (req, res) => {
//     const firstName = req.query.firstName; // ✅ Fix: Use `query`, not `body`

//     try {
//         const users = await User.find({ firstName });

//         if (users.length === 0) {
//             return res.status(404).json({ error: "No user found" });
//         }

//         res.json(users);
//     } catch (err) {
//         res.status(400).json({ error: err.message });
//     }
// });

// // 🔹 UPDATE USER (Fixed `PATCH`)
// app.patch("/update/:userId", async (req, res) => {
//     const id = req.params.userId;
//     const data = req.body;

//     try {
//         const allowedUpdates = ["firstName", "lastName", "phone", "gender", "password"]; // ✅ Removed `"id"`
//         const isValidUpdate = Object.keys(data).every((key) => allowedUpdates.includes(key));

//         if (!isValidUpdate) {
//             return res.status(400).json({ error: "Invalid update fields" });
//         }

//         const user = await User.findByIdAndUpdate(id, data, {
//             new: true, // ✅ Fix: Use `new: true`
//             runValidators: true
//         });

//         if (!user) {
//             return res.status(404).json({ error: "User not found" });
//         }

//         res.json({ message: "User updated successfully", user });
//     } catch (err) {
//         res.status(400).json({ error: err.message });
//     }
// });

// 🔹 CONNECT TO DATABASE & START SERVER
    connectDB().then(() => {
    console.log("Connected to database");
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
}).catch((err) => {
    console.log("Database connection error:", err);
});
