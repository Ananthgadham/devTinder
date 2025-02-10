const mongoose=require('mongoose');
const connectDB=async()=>{
        await mongoose.connect("mongodb+srv://Ananth:162341@namstenode.l21ma.mongodb.net/devTinder");
}

module.exports=connectDB;