const mongoose=require('mongoose');
const validator=require('validator');
const userSchema=new mongoose.Schema({
   firstName:{
    type:String,
    required:true,
    unique:true
   },
   lastName:{
    type:String,
   },
   email:{
    type:String,
    required:true,
    lowercase:true,
    validate(value){
        if(!validator.isEmail(value))
        {
            throw new Error("invalid email"+value);
        }
    }
   },
   phone:{
    type:String,
   },
   gender:{
    type:String,
    validate(value){
      if(!["male","female","others"].includes(value))
        {
            throw new Error("invalid gender");
        }
    },
   },
   password:{
    type:String,
    required:true,
    validate(value){
      if(!validator.isStrongPassword(value))
      {
         throw new Error("password is not strong");
      }
    }
   }
},{timestamps:true});
  module.exports=mongoose.model('User',userSchema);