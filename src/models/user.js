const mongoose=require('mongoose');
const validator=require('validator');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      unique: true,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email: " + value);
        }
      },
    },
    phone: {
      type: String,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Invalid gender");
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Password is not strong");
        }
      },
    },
    profilePic: {
      type: String, // Step 1: Add profilePic field to store image URL
      required: false, // Optional, as the user may sign up without an image
    },
  },
  { timestamps: true }
);

userSchema.methods.getJWT=async function(){
     const user=this;
     const token= await jwt.sign({_id:user._id},"DEV@TINDER",{expiresIn:"1h"});
     return token;
}

     userSchema.methods.validatePassword=async function(inputpassword){
     const user=this;
      const hashpassword=user.password;
      const isPasswordValid= await bcrypt.compare(inputpassword,hashpassword);
      return isPasswordValid;
}

  module.exports=mongoose.model('User',userSchema);