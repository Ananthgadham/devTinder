const express = require('express');
const connectDB = require('./config/database');
const cors=require("cors");
const User=require("./models/user");
const cookieParser=require("cookie-parser");
const app = express();
app.use(express.json());
app.use(cookieParser())

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
}));

app.use("/",require("./routes/profile"));

app.use("/",require("./routes/request"));

app.use("/",require("./routes/auth"));

app.use("/",require("./routes/user"));






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

// 🔹 UPDATE USER (Fixed `PATCH`)


// 🔹 CONNECT TO DATABASE & START SERVER
    connectDB().then(() => {
    console.log("Connected to database");
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
}).catch((err) => {
    console.log("Database connection error:", err);
});
